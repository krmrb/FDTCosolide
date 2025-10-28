import { Calendar, EventContentArg, DatesSetArg, EventClickArg, EventDropArg, EventMountArg } from '@fullcalendar/core'
import { Draggable } from '@fullcalendar/interaction'
import frLocale from '@fullcalendar/core/locales/fr'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { Modal } from 'bootstrap'

interface CalendarEvent {
  id: string
  title: string
  start: Date
  end: Date
  allDay: boolean
  extendedProps: {
    heureDebutReelle?: string
    heureFinReelle?: string
    affectTimeSlotsRange?: boolean
  }
  textColor?: string
}

interface HoraireCalendarForm {
  employeId: number
  periodeId: number
  description: string
  dateHeureDebut: string
  dateHeureFin: string
  commentaire: string
  corpEmploiCode: string
  lieuTravailCode: string
  motifCode: string
  statut: number
}

declare global {
  interface Window {
    sieCalandarHoraire: any
    calendarLocale: string
    sieDebugCompilation: string
    selectedCalendarEvent: any
  }
}

class HoraireCalendar {
  private calendarEl: HTMLElement
  private datepickerEl: HTMLInputElement
  private currentView: string | null
  private calendar: Calendar | null
  private url: string

  constructor(calendarEl: HTMLElement, datepickerEl: HTMLInputElement, url: string) {
    this.calendarEl = calendarEl
    this.datepickerEl = datepickerEl
    this.currentView = null
    this.calendar = null
    this.url = url
    this.init()

    window.sieCalandarHoraire = this.calendar
  }

   private init(): void {
      this.restoreOptionsState()

      const calendarLocale = 'fr'

      this.calendar = new Calendar(this.calendarEl, {
         initialView: window.innerWidth < 576 ? 'timeGridDay' : 'timeGridWeek',
         themeSystem: 'standard',
         slotMinTime: '08:00:00',
         slotMaxTime: '18:00:00',
         aspectRatio: 2,
         height: 'auto',
         plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
         events: this.fetchEvents.bind(this),
         editable: true,
         eventDurationEditable: true,
         eventDrop: this.handleEventDrop.bind(this),
         droppable: true,
         eventReceive: this.handleEventReceive.bind(this),
         eventDidMount: this.handleEventContextMenu.bind(this),
         allDaySlot: false,
         locale: frLocale,
         displayEventTime: false,
         firstDay: 0,
         headerToolbar: {
            left: 'prev',
            center: 'today',
            right: 'dayGridMonth,timeGridWeek next'
         },
         datesSet: this.onDatesSet.bind(this),
         eventClick: this.handleEventClick.bind(this),
         dayHeaderFormat: this.getDayFormat(),
         dayHeaderContent: this.customDayHeaderContent
      })

      this.setupToolbarObserver()
      this.calendar.render()
      this.currentView = this.calendar.view.type

      this.setupDatepicker()
      this.setupResizeListener()
   }

   private initializeHeaderDraggables(): void {
      const headerEvents = document.querySelector('.header-draggable-events')
      if (headerEvents) {
         this.initializeHeaderDraggable(headerEvents as HTMLElement)
      }
   }

   private handleEventReceive(info: any): void {
      const event = info.event
      console.log("Événement ajouté par drag & drop :", event)
   }

   private handleEventDrop(info: EventDropArg): void {
      const event = info.event
      const newStart = event.start
      const newEnd = event.end

      console.log("Événement déplacé :", {
      id: event.id,
      title: event.title,
      newStart,
      newEnd
      })
   }

   private handleEventContextMenu(info: EventMountArg): void {
      info.el.addEventListener('contextmenu', (e: MouseEvent) => {
      e.preventDefault()

      const menu = document.getElementById('context-menu')
      if (menu) {
         menu.style.display = 'block'
         menu.style.left = `${e.pageX}px`
         menu.style.top = `${e.pageY}px`
      }

      window.selectedCalendarEvent = info.event
      })
   }

   private restoreOptionsState(): void {
      document.querySelectorAll('.form-check-input').forEach((input: Element) => {
      const htmlInput = input as HTMLInputElement
      const saved = localStorage.getItem(htmlInput.id)
      if (saved !== null) {
         htmlInput.checked = (saved === 'true')
      }
      })
   }

   private setupDatepicker(): void {
      this.datepickerEl.addEventListener('change', () => {
         const selectedDate = new Date(this.datepickerEl.value)
            if (this.calendar) {
               this.calendar.gotoDate(selectedDate)
            }
      })

      this.datepickerEl.addEventListener('focus', () => {
         if ('showPicker' in HTMLInputElement.prototype) {
            this.datepickerEl.showPicker()
         }
      })

      this.datepickerEl.addEventListener('mousedown', (e: MouseEvent) => {
         this.datepickerEl.blur()
         this.datepickerEl.focus()
      })
   }

   private setupResizeListener(): void {
      window.addEventListener('resize', () => {
         if (this.calendar) {
            this.calendar.setOption('dayHeaderFormat', this.getDayFormat())
            const newView = window.innerWidth < 768 ? 'timeGridDay' : 'timeGridWeek'
            if (newView !== this.currentView) {
               this.calendar.changeView(newView)
               this.currentView = newView
            }
         }
      })
   }

   private setupToolbarObserver(): void {
      const waitForToolbar = new MutationObserver((mutations: MutationRecord[], observer: MutationObserver) => {
         const toolbar = document.querySelector('.fc-header-toolbar')
         if (toolbar) {
            observer.disconnect()
            this.observeToolbarChunks(toolbar)
         }
      })

      waitForToolbar.observe(document.body, {
         childList: true,
         subtree: true
      })
   }

   private observeToolbarChunks(toolbar: Element): void {
      const chunkObserver = new MutationObserver((mutationsList: MutationRecord[]) => {
         for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
               mutation.addedNodes.forEach((node: Node) => {
                  if (
                     node.nodeType === 1 &&
                     (node as Element).classList.contains('fc-toolbar-chunk') &&
                     (node as Element).children.length === 0
                  ) {
                     const element = node as Element
                     element.remove()
                  }
               })
            }
         }
      })

      chunkObserver.observe(toolbar, {
         childList: true,
         subtree: false
      })
   }

   private getDayFormat(): any {
      const width = window.innerWidth
      if (width >= 1000) return { weekday: 'long', day: 'numeric', month: 'short' }
      if (width >= 500) return { weekday: 'short', day: 'numeric', month: 'short' }
      return { weekday: 'long', day: 'numeric', month: 'short' }
   }

   private customEventContent(arg: EventContentArg): { domNodes: HTMLElement[] } {
      const div = document.createElement('div')
      div.style.color = arg.event.textColor || 'black'
      const title = document.createElement('span')
      title.textContent = arg.event.title
      div.appendChild(title)
      return { domNodes: [div] }
   }

   private customDayHeaderContent(arg: any): { html: string } {
      const parts = arg.text.split(' ')
      return { html: `<div>${parts[0]}</div><div>${parts[1]} ${parts[2]}</div>` }
   }

   private onDatesSet(info: DatesSetArg): void {
      this.updateCalendarTitle(info)

      const todayButton = document.querySelector('.fc-today-button')
      const datepicker = document.getElementById('datepicker-container')
      const filter = document.getElementById('filter-container')?.closest('.fc-toolbar-chunk')

      if (todayButton && datepicker) {
         const toolbar = todayButton.closest('.fc-header-toolbar')
         const todayChunk = todayButton.closest('.fc-toolbar-chunk')

         if (toolbar && todayChunk) {
            const nouveauChunk = document.createElement('div')
            nouveauChunk.className = 'fc-toolbar-chunk d-flex align-items-center gap-2'

            nouveauChunk.appendChild(datepicker)
            nouveauChunk.appendChild(todayButton)

            // Créer les boutons directement dans le header
            const buttonsContainer = document.createElement('div')
            buttonsContainer.className = 'header-draggable-events d-flex gap-2'
            
            const absenceButton = this.createDraggableButton('Absence', 'btn-primary')
            const reunionButton = this.createDraggableButton('Paiement', 'btn-primary')
            
            buttonsContainer.appendChild(absenceButton)
            buttonsContainer.appendChild(reunionButton)
            nouveauChunk.appendChild(buttonsContainer)

            if (filter) {
               nouveauChunk.appendChild(filter)
               if (window.sieDebugCompilation === '1') {
                  this.addHiddenDeveloperExportButtons(filter)
               }
            }

            toolbar.replaceChild(nouveauChunk, todayChunk)

            // Réinitialiser draggable sur les nouveaux boutons
            this.initializeHeaderDraggable(buttonsContainer)
         }
      }
   }

   private createDraggableButton(title: string, btnClass: string): HTMLButtonElement {
      const button = document.createElement('button');
      button.className = `fc-event btn ${btnClass} draggable-event`;
      button.setAttribute('data-event', JSON.stringify({ title }));
      button.type = 'button'; 

      button.style.cursor = 'grab';
      button.style.margin = '0'; 
      let iconHTML = '';
      if (title.toLowerCase() === 'absence') {
         iconHTML = '<i class="bi bi-person-dash text-light" title="Demander une absence"></i>';
      } else if (title.toLowerCase() === 'paiement') {
         iconHTML = '<i class="bi bi-cash-stack text-light" title="Demander un paiement"></i>';
      }

      button.innerHTML = iconHTML;
      return button;
   }

   private initializeHeaderDraggable(container: HTMLElement): void {
      // Réinitialiser Draggable sur les nouveaux boutons
      new Draggable(container, {
            itemSelector: '.draggable-event',
            eventData: function (eventEl: Element) {
            const htmlElement = eventEl as HTMLElement
            const data = htmlElement.getAttribute('data-event')
            return data ? JSON.parse(data) : { title: htmlElement.innerText.trim() }
            }
      })
   }

   private formatDateTime(date: Date): string {
      if (date) {
         const pad = (n: number) => n.toString().padStart(2, '0')

         const year = date.getFullYear()
         const month = pad(date.getMonth() + 1)
         const day = pad(date.getDate())
         const hours = pad(date.getHours())
         const minutes = pad(date.getMinutes())
         const seconds = pad(date.getSeconds())

         return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
      }

      return ''
   }

   private addHiddenDeveloperExportButtons(filterContainer: Element): void {
      const exportBtnJSON = document.createElement('button')
      exportBtnJSON.id = 'exportBtnJSON'
      exportBtnJSON.textContent = 'Exporter JSON'
      exportBtnJSON.className = "btn sie-btn-success"
      exportBtnJSON.type = 'button'
      exportBtnJSON.style.display = 'none'

      filterContainer.parentNode?.appendChild(exportBtnJSON)

      const self = this

      exportBtnJSON.addEventListener('click', function () {
         const events = window.sieCalandarHoraire.getEvents()

         events.sort((a: CalendarEvent, b: CalendarEvent) => new Date(a.start).getTime() - new Date(b.start).getTime())

         const eventsForJSON = events.map((event: CalendarEvent) => ({
            start: self.formatDateTime(event.start),
            end: self.formatDateTime(event.end),
            allDay: event.allDay,
            heureDebutReelle: event.extendedProps.heureDebutReelle,
            heureFinReelle: event.extendedProps.heureFinReelle,
            title: event.title,
            affectTimeSlotsRange: event.extendedProps.affectTimeSlotsRange
         }))

         const blob = new Blob([JSON.stringify(eventsForJSON, null, 2)], { type: 'application/json' })
         const url = URL.createObjectURL(blob)

         const a = document.createElement('a')
         a.href = url
         a.download = 'calendar-events.json'
         a.click()

         URL.revokeObjectURL(url)
      })

      const exportBtnCSV = document.createElement('button')
      exportBtnCSV.id = 'exportEventsBtn'
      exportBtnCSV.className = "btn sie-btn-success"
      exportBtnCSV.type = 'button'
      exportBtnCSV.textContent = 'Exporter CSV'
      exportBtnCSV.style.display = 'none'

      filterContainer.parentNode?.appendChild(exportBtnCSV)

      exportBtnCSV.addEventListener('click', function () {
         const events = window.sieCalandarHoraire.getEvents()

         events.sort((a: CalendarEvent, b: CalendarEvent) => new Date(a.start).getTime() - new Date(b.start).getTime())

         const csvRows = [
            ['Debut', 'Fin', 'HeureDebutReelle', 'HeureFinReelle', 'Titre', 'affectTimeSlotsRange']
         ]

         events.forEach((event: CalendarEvent) => {
            csvRows.push([
               self.formatDateTime(event.start),
               self.formatDateTime(event.end),
               event.extendedProps.heureDebutReelle || '',
               event.extendedProps.heureFinReelle || '',
               String(event.extendedProps.affectTimeSlotsRange || ''),
               event.title
            ])
         })

         const csvContent = csvRows.map(row => row.join(';')).join('\n')
         const blob = new Blob([csvContent], { type: 'text/csv' })
         const url = URL.createObjectURL(blob)

         const a = document.createElement('a')
         a.href = url
         a.download = 'calendar-events.csv'
         a.click()

         URL.revokeObjectURL(url)
      })

      document.addEventListener('keydown', function (e: KeyboardEvent) {
         if (e.ctrlKey && e.shiftKey && e.key === 'E') {
            exportBtnJSON.style.display = 'inline-block'
            exportBtnCSV.style.display = 'inline-block'
         }
      })
   }

   private updateCalendarTitle(info: DatesSetArg): void {
      const startDate = info.start
      const formattedStartDate = `${startDate.getFullYear()}-${String(startDate.getMonth() + 1).padStart(2, '0')}-${String(startDate.getDate()).padStart(2, '0')}`
      this.datepickerEl.value = formattedStartDate
      
      const titleElement = document.getElementById('calendar-title')
      if (titleElement) {
         titleElement.textContent = info.view.title
      }
   }

   private async fetchEvents(
         info: any,
         successCallback: (events: any[]) => void,
         failureCallback: (error: Error) => void
         ): Promise<void> {

      console.log('fetchEvents called with:', info)

      // SIMULATION AVEC DONNÉES MOCKÉES
      console.log('🚀 API simulée - utilisation de données de test')

      const mockEvents = [
         {
            id: '1',
            title: 'Absence',
            start: new Date('2025-10-30T08:30:00'),
            end: new Date('2025-10-30T14:00:00'),
            allDay: false,
            className: 'fc-event-absence',
            // FORÇAGE DIRECT aussi au cas où
            backgroundColor: '#FFA500',
            borderColor: '#FF8C00', 
            textColor: '#000000'
         },
         {
            id: '2',
            title: 'Paiement', 
            start: new Date('2025-10-27T08:30:00'),
            end: new Date('2025-10-27T14:00:00'),
            allDay: false,
            className: 'fc-event-paiement',
            // FORÇAGE DIRECT aussi au cas où
            backgroundColor: '#87CEEB',
            borderColor: '#4682B4',
            textColor: '#000000'
         },
         {
            id: '3',
            title: 'Paiement', 
            start: new Date('2025-10-28T08:30:00'),
            end: new Date('2025-10-28T14:00:00'),
            allDay: false,
            className: 'fc-event-paiement',
            backgroundColor: '#87CEEB',
            borderColor: '#4682B4',
            textColor: '#000000'
         },
         // 4. Absence - 3 au 6 novembre 2025
         {
            id: '4',
            title: 'Absence',
            start: new Date('2025-11-03T08:00:00'),
            end: new Date('2025-11-06T17:00:00'),
            allDay: false,
            className: 'fc-event-absence', // ← Classe CSS personnalisée
            backgroundColor: '#FFA500',
            textColor: '#000000'
         }
      ]
      successCallback(mockEvents)
   }

   private handleEventClick(info: EventClickArg): void {
      if (!info.jsEvent || !info.event.start || !info.event.end) return

      const { heureDebutReelle, heureFinReelle } = info.event.extendedProps
      const plageNuitChevauche = heureDebutReelle > heureFinReelle && heureFinReelle !== "00:00"
      const eventDate = new Date(info.event.start)
      
      const options: Intl.DateTimeFormatOptions = {
         weekday: 'long',
         year: 'numeric',
         month: 'long',
         day: 'numeric',
         ...(plageNuitChevauche ? {} : { hour: '2-digit', minute: '2-digit' })
      }
      
      let formattedDate = eventDate.toLocaleDateString('fr-FR', options)
      formattedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1)
      const formattedTime = `${heureDebutReelle} - ${heureFinReelle}`

      const modalLabel = document.getElementById('eventModalLabel')
      const eventTitle = document.getElementById('eventTitle')
      
      if (modalLabel) {
         modalLabel.innerHTML = `${formattedDate}<br>${formattedTime}`
      }
      
      if (eventTitle) {
         eventTitle.textContent = info.event.title
      }

      const modal = document.getElementById('eventModalDialog')
      if (modal) {
         modal.classList.add('popup-shadow')
         modal.style.position = 'fixed'

         let left = info.jsEvent.clientX + 10
         let top = info.jsEvent.clientY + 10
         const modalWidth = modal.offsetWidth || 300
         const modalHeight = modal.offsetHeight || 200

         if (left + modalWidth > window.innerWidth) {
            left = window.innerWidth - modalWidth - 10
         }
         
         if (top + modalHeight > window.innerHeight) {
            top = window.innerHeight - modalHeight - 10
            if (top < 10) top = 10
         }

         modal.style.left = `${left}px`
         modal.style.top = `${top}px`
      }

      const eventModalElement = document.getElementById('eventModal')
      if (eventModalElement) {
         const eventModal = new Modal(eventModalElement)
         eventModal.show()
      }
   }
}

export default HoraireCalendar