import { Component, NgZone, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

///////////////////////////// sdsdsdasdasdads hastaa aquiii
export class AppComponent implements OnInit, OnDestroy {
  contadores: { [key: string]: Contador } = {
    biTrenGlobulus: {
      id: 0,
      nombre: 'biTrenGlobulus',
      valor: 0,
      fecha_hora: null,
      operador: null,
      linea: null,
      turno: null,
      maquina: null
    },
    biTrenNitens: {
      id: 0,
      nombre: 'biTrenNitens',
      valor: 0,
      fecha_hora: null,
      operador: null,
      linea: null,
      turno: null,
      maquina: null
    },
    camionExterno: {
      id: 0,
      nombre: 'camionExterno',
      valor: 0,
      fecha_hora: null,
      operador: null,
      linea: null,
      turno: null,
      maquina: null
    }
  };

  timers: { [key: string]: Timer } = {
    lineaDetenida: {
      timerRunning: false,
      fechainicio: null,
      fechafin: null,
      starttimernumber: null,
      stoptimernumber: null,
      operador: null,
      linea: null,
      turno: null,
      maquina: null
    },
    lineaSinMadera: {
      timerRunning: false,
      fechainicio: null,
      fechafin: null,
      starttimernumber: null,
      stoptimernumber: null,
      operador: null,
      linea: null,
      turno: null,
      maquina: null
    },
    LimpiezaBunker: {
      timerRunning: false,
      fechainicio: null,
      fechafin: null,
      starttimernumber: null,
      stoptimernumber: null,
      operador: null,
      linea: null,
      turno: null,
      maquina: null
    },
    LimpiezaZonaAlimentacion: {
      timerRunning: false,
      fechainicio: null,
      fechafin: null,
      starttimernumber: null,
      stoptimernumber: null,
      operador: null,
      linea: null,
      turno: null,
      maquina: null
    },
    Mantencion: {
      timerRunning: false,
      fechainicio: null,
      fechafin: null,
      starttimernumber: null,
      stoptimernumber: null,
      operador: null,
      linea: null,
      turno: null,
      maquina: null
    },
    CambioDeTurno: {
      timerRunning: false,
      fechainicio: null,
      fechafin: null,
      starttimernumber: null,
      stoptimernumber: null,
      operador: null,
      linea: null,
      turno: null,
      maquina: null
    },
    Colacion: {
      timerRunning: false,
      fechainicio: null,
      fechafin: null,
      starttimernumber: null,
      stoptimernumber: null,
      operador: null,
      linea: null,
      turno: null,
      maquina: null
    }
    
  };

  consoleLogs: string[] = [];  // DATOS PARA MOSTRAR 
  timers2: { id: number; nombre: string; timer: Timer }[] = [];
  timers2Counter: number = 0;
  contadores2: { id: number; nombre: string; valor: number; fecha_hora: string }[] = [];
  contadores2Counter: number = 0;

  intervalIds: { [key: string]: any } = {};  //se cambio de NUMBER a ANY
  currentDateTime: string = '';
  showClock: boolean = false;
  contadorBiTrenGlobulus: number = 0;
  contadorBiTrenNitens: number = 0;
  contadorCamionExterno: number = 0;
  //contadorCamionGlobulus: number = 0;
  //contadorCamionNitens: number = 0;
  lastClickButtons: { [key: string]: number } = {};

  constructor(private ngZone: NgZone,
    private cdr: ChangeDetectorRef
    //,    private dialog: MatDialog
  ) ////////////////borrando esto se arregla lo de la pantalla en blanco
  { }

  toggleTimer(timerName: string): void {
    const timer = this.timers[timerName];

    if (!timer.timerRunning) {
      // Check if any other timer is already running
      const runningTimer = Object.values(this.timers).find(t => t.timerRunning);
      if (runningTimer) {
        console.log(`No se puede iniciar el temporizador "${timerName}" porque "${runningTimer}" ya está en ejecución.`);
        return;
      }

      const currentDate = new Date();
      timer.fechainicio = this.formatDateTime(currentDate);
      timer.starttimernumber = this.convertFecha(currentDate);

      // Resetear el valor de fechafin a null si está definido
      timer.fechafin = null;

      // Eliminar el último valor de stoptimernumber si existe
      if (timer.stoptimernumber) {
        this.removeLastStopTime(timerName);
      }

      this.intervalIds[timerName] = setInterval(() => {
        this.updateTimer(timerName);
      }, 1000);
    } else {
      const currentDate = new Date();
      timer.fechafin = this.formatDateTime(currentDate);
      timer.stoptimernumber = this.convertFecha(currentDate);

      clearInterval(this.intervalIds[timerName]);
    }

    this.exportDataToJson();
    timer.timerRunning = !timer.timerRunning;
  }

  removeLastStopTime(timerName: string): void {
    const timer = this.timers[timerName];
    const contadorIndex = this.contadores2.findIndex(c => c.nombre === timerName);

    if (contadorIndex !== -1) {
      this.contadores2[contadorIndex].fecha_hora = this.contadores2[contadorIndex].fecha_hora.replace(/ \d{2}:\d{2}:\d{2}$/, '');
      this.exportDataToJson();
    }
  }

  updateTimer(timerName: string): void {
    const timer = this.timers[timerName];
    const currentDate = new Date();
    const currentTimestamp = this.convertFecha(currentDate);
    const elapsedTime = currentTimestamp - timer.starttimernumber!;

    const hours = Math.floor(elapsedTime / 3600);
    const minutes = Math.floor((elapsedTime % 3600) / 60);
    const seconds = Math.floor((elapsedTime % 3600) % 60);

    const timerValue = `${this.formatTime(hours)}:${this.formatTime(minutes)}:${this.formatTime(seconds)}`;

    this.ngZone.run(() => {
      timerValue;
    });
  }

  formatTime(time: number): string {
    return time < 10 ? `0${time}` : `${time}`;
  }

  convertFecha(fecha: Date): number {
    return Math.round(fecha.getTime() / 1000);
  }

  resetTimer(timerName: string): void {
    const timer = this.timers[timerName];

    clearInterval(this.intervalIds[timerName]);
    timer.timerRunning = false;
    timer.fechainicio = null;
    timer.fechafin = null;
    timer.starttimernumber = null;
    timer.stoptimernumber = null;
  }

  stopAllTimers(): void {
    for (const timerName in this.timers) {
      if (this.timers.hasOwnProperty(timerName)) {
        const timer = this.timers[timerName];

        if (timer.timerRunning) {
          clearInterval(this.intervalIds[timerName]);
          timer.timerRunning = false;
          timer.fechafin = null;
          timer.starttimernumber = null;
          timer.stoptimernumber = null;
        }
      }
    }
  }


  stopTimer(timerName: string): void {
    const timer = this.timers[timerName];

    if (timer.timerRunning) {
      timer.timerRunning = false;
      const currentDate = new Date();
      timer.fechafin = this.formatDateTime(currentDate);
      timer.stoptimernumber = this.convertFechaToNumber(currentDate);
      window.cancelAnimationFrame(this.intervalIds[timerName]);
      this.currentDateTime = '';

      console.log('Fin Timer', timerName, timer.fechafin);

      const elapsedTime = this.getElapsedTimeDifference(timer);
      console.log('Tiempo transcurrido:', elapsedTime);

      // Agregar el timer a timers2
      this.timers2Counter++;
      this.timers2.push({ id: this.timers2Counter, nombre: timerName, timer: { ...timer } });
      this.exportDataToJson();
    }
  }

  getElapsedTimeDifference(timer: Timer): string {
    const start = timer.starttimernumber ? new Date(timer.starttimernumber) : null;
    const stop = timer.stoptimernumber ? new Date(timer.stoptimernumber) : null;

    if (start && stop) {
      let elapsedMilliseconds = Math.abs(stop.getTime() - start.getTime());

      const hours = Math.floor(elapsedMilliseconds / 3600000);
      const minutes = Math.floor((elapsedMilliseconds % 3600000) / 60000);
      const seconds = Math.floor((elapsedMilliseconds % 60000) / 1000);

      const formattedTime = `${this.padZero(hours)}:${this.padZero(minutes)}:${this.padZero(seconds)}`;
      return formattedTime;
    }

    return '';
  }

  formatDateTime(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
  }

  convertFechaToNumber(date: Date): number {
    return date.getTime();
  }

  updateClock(): void {
    const currentDate = new Date();
    this.ngZone.run(() => {
      this.currentDateTime = currentDate.toLocaleTimeString();
      this.intervalIds['clock'] = window.requestAnimationFrame(() => {
        this.updateClock();
      });
    });
  }

  getButtonLabel(timer: Timer): string {
    return timer.timerRunning ? 'Reactivar Línea' : 'Detener Línea';
  }

  padZero(value: number): string {
    return value.toString().padStart(2, '0');
  }

  logClickDate(contador: string, currentTime: number): void {
    const clickDate = new Date(currentTime);
    const day = clickDate.getDate().toString().padStart(2, '0');
    const month = (clickDate.getMonth() + 1).toString().padStart(2, '0');
    const year = clickDate.getFullYear();
    const formattedDate = `${day}-${month}-${year}`;

    // Formatear la hora con ceros a la izquierda
    const hours = clickDate.getHours().toString().padStart(2, '0');
    const minutes = clickDate.getMinutes().toString().padStart(2, '0');
    const seconds = clickDate.getSeconds().toString().padStart(2, '0');
    const formattedTime = `${hours}:${minutes}:${seconds}`;

    // Usar espacio como separador entre fecha y hora
    const formattedDateTime = `${formattedDate}  ${formattedTime}`;
    console.log(`Fecha de clic en ${contador}: ${formattedDateTime}`);

    // Agregar el contador a contadores2 con la fecha del clic
    this.contadores2Counter++;
    this.contadores2.push({ id: this.contadores2Counter, nombre: contador, valor: this.getContadorValue(contador), fecha_hora: formattedDateTime });
  }

  //////////////////////////////////////////
  isAnyCounterDecreased(): boolean {
    return (
      this.contadorBiTrenGlobulus < 0 ||
      this.contadorBiTrenNitens < 0 ||
      this.contadorCamionExterno < 0
    );
  }
  aumentarContador(contador: string): void {
    if (this.isAnyTimerRunning() || this.isAnyCounterDecreased()) {
      alert('Debes reactivar la línea para poder aumentar el contador');
      return;
    }

    const currentTime = Date.now();
    const lastClickTime = this.lastClickButtons[contador];
    let operador: string | null = null;
    let linea: string | null = null;
    let turno: string | null = null;
    let maquina: string | null = null;


    if (!lastClickTime || (currentTime - lastClickTime) >= 120000) {
      // Permitir incrementar el contador
      switch (contador) {
        case 'biTrenGlobulus':
          this.contadorBiTrenGlobulus++;
          console.log('Contador BiTren Globulus:', this.contadorBiTrenGlobulus);
          this.logClickDate(contador, currentTime); // Guardar la fecha del clic
          console.log(`Operador: ${operador}`);
          console.log(`Línea: ${linea}`);
          console.log(`Turno: ${turno}`);
          console.log(`Máquina: ${maquina}`);
          break;
        case 'biTrenNitens':
          this.contadorBiTrenNitens++;
          console.log('Contador BiTren Nitens:', this.contadorBiTrenNitens);
          this.logClickDate(contador, currentTime); // Guardar la fecha del clic
          console.log(`Operador: ${operador}`);
          console.log(`Línea: ${linea}`);
          console.log(`Turno: ${turno}`);
          console.log(`Máquina: ${maquina}`);
          break;
        case 'camionExterno':
          this.contadorCamionExterno++;
          console.log('Contador Camión Externo:', this.contadorCamionExterno);
          this.logClickDate(contador, currentTime); // Guardar la fecha del clic
          console.log(`Operador: ${operador}`);
          console.log(`Línea: ${linea}`);
          console.log(`Turno: ${turno}`);
          console.log(`Máquina: ${maquina}`);
          break;
        // Agrega casos para otros contadores si es necesario
        default:
          break;

      }

      // Actualizar el último tiempo de clic
      this.lastClickButtons[contador] = currentTime;
    } else {
      // Mostrar el pop-up indicando que el botón está bloqueado
      const buttonName = this.getButtonName(contador);
      alert(`El botón "${buttonName}" está bloqueado. Espere 2 minutos para poder hacer clic nuevamente.`);
    }

    this.exportDataToJson();
  }

  getContadorValue(contador: string): number {
    switch (contador) {
      case 'biTrenGlobulus':
        return this.contadorBiTrenGlobulus;

      case 'biTrenNitens':
        return this.contadorBiTrenNitens;

      case 'camionGlobulus':
        return this.contadorCamionExterno;
      default:
        return 0;
    }
  }

  getButtonName(contador: string): string {
    switch (contador) {
      case 'biTrenGlobulus':
        return 'BiTren Globulus';

      case 'biTrenNitens':
        return 'BiTren Nitens';

      case 'camionExterno':
        return 'Camión Externo';
      default:
        return '';
    }
  }

  getTotalContador(): number {
    return this.contadorBiTrenGlobulus + this.contadorCamionExterno + this.contadorBiTrenNitens;
  }

  initializeCounters(): void {
    // Verificar si hay contadores almacenados en el JSON
    const storedCounters = localStorage.getItem('counters');
    if (storedCounters) {
      const counters = JSON.parse(storedCounters);

      // Verificar si el último contador tiene un valor igual a 1
      const lastCounter = counters[counters.length - 1];
      if (lastCounter && lastCounter.valor === 1) {
        // Establecer el valor del último contador en 0
        lastCounter.valor = 0;
      }

      // Actualizar los contadores en la aplicación
      this.contadores2 = counters;
      this.contadores2Counter = counters.length;
    }
  }

  exportDataToJson(): void {
    const totalContadorId = this.contadores2Counter + 1; // ID incremental basada en contadores2Counter

    const data = {
      timers: this.timers,
      contadores: this.contadores2,
      totalContador: {
        id: totalContadorId,
        valor: this.getTotalContador()
      }
    };

    const jsonData = JSON.stringify(data);
    console.log(jsonData);

  }

  revertLastClick(contador: string): void {
    switch (contador) {
      case 'biTrenGlobulus':
        if (this.contadorBiTrenGlobulus > 0) {
          this.contadorBiTrenGlobulus--;
          this.removeLastClickDate(contador);
          console.log('Revertido el último clic en BiTren Globulus');
        }
        break;

      case 'biTrenNitens':
        if (this.contadorBiTrenNitens > 0) {
          this.contadorBiTrenNitens--;
          this.removeLastClickDate(contador);
          console.log('Revertido el último clic en BiTren Nitens');
        }
        break;

      case 'camionNitens':
        if (this.contadorCamionExterno > 0) {
          this.contadorCamionExterno--;
          this.removeLastClickDate(contador);
          console.log('Revertido el último clic en Camión Externo Nitens');
        }
        break;
      default:
        break;
    }
    this.exportDataToJson();
  }

  removeLastClickDate(contador: string): void {
    const contadorIndex = this.contadores2.findIndex(c => c.nombre === contador);

    if (contadorIndex !== -1) {
      const lastClick = this.contadores2[contadorIndex].fecha_hora;
      this.contadores2.splice(contadorIndex, 1);
      console.log(`Eliminada la fecha del último clic en ${contador}: ${lastClick}`);
    } else {
      // Si no se encuentra un registro con el contador especificado, buscar el último registro en general y eliminarlo
      const lastContadorIndex = this.contadores2.length - 1;
      if (lastContadorIndex >= 0) {
        const lastClick = this.contadores2[lastContadorIndex].fecha_hora;
        this.contadores2.splice(lastContadorIndex, 1);
        console.log(`Eliminada la fecha del último clic en ${contador}: ${lastClick}`);
      }
    }

    this.exportDataToJson();
  }
  isAnyTimerRunning(): boolean {
    for (const timerName in this.timers) {
      if (this.timers[timerName].timerRunning) {
        return true;
      }
    }
    return false;
  }
  restarUnoBiTrenGlobulus(): void {
    if (this.isAnyTimerRunning()) {
      alert('No puedes restar al contador si la línea está detenida');
      return;
    }

    if (this.contadorBiTrenGlobulus > 0) {
      this.contadorBiTrenGlobulus--;
      this.removeLastClickDate('biTrenGlobulus'); // Corregir el nombre del contador aquí
      this.exportDataToJson();
      console.log('Revertido el último clic en BiTren Globulus');
    }

    const currentTime = Date.now();
    this.lastClickButtons['biTrenGlobulus'] = currentTime - 120000; // Corregir el nombre del contador aquí
  }



  restarUnoBiTrenNitens(): void {
    if (this.isAnyTimerRunning()) {
      alert('No puedes restar al contador si la línea está detenida');
      return;
    }

    if (this.contadorBiTrenNitens > 0) {
      this.contadorBiTrenNitens--;
      this.removeLastClickDate('biTrenNitens');
      this.exportDataToJson();
      console.log('Revertido el último clic en BiTren Nitens');
    }

    const currentTime = Date.now();
    this.lastClickButtons['biTrenNitens'] = currentTime - 120000;
  }

  restarUnoCamionExterno(): void {
    if (this.isAnyTimerRunning()) {
      alert('No puedes restar al contador si la línea está detenida');
      return;
    }

    if (this.contadorCamionExterno > 0) {
      this.contadorCamionExterno--;
      this.removeLastClickDate('camionExterno');
      this.exportDataToJson();
      console.log('Revertido el último clic en Camión Externo');
    }

    const currentTime = Date.now();
    this.lastClickButtons['camionExterno'] = currentTime - 120000;
  }

  confirmarRestar(contador: string): void {
    const confirmacion = confirm(`¿Está seguro que desea restar 1 a ${contador}?`);
    if (confirmacion) {
      switch (contador) {
        case 'biTrenGlobulus':
          this.restarUnoBiTrenGlobulus();
          break;
        case 'biTrenNitens':
          this.restarUnoBiTrenNitens();
          break;
        case 'camionExterno':
          this.restarUnoCamionExterno();
          break;
        // Agrega más casos para otros contadores
      }
    }
  }

  updateJsonCounterValue(contador: string, valor: number): void {
    const contadorIndex = this.contadores2.findIndex(c => c.nombre === contador);

    if (contadorIndex !== -1) {
      this.contadores2[contadorIndex].valor = valor;
      this.exportDataToJson(); // Actualiza el JSON con el nuevo valor del contador
    }
  }

  ngOnInit(): void {
    this.updateClock();
  }

  ngOnDestroy(): void {
    window.cancelAnimationFrame(this.intervalIds['clock']);
  }
}

interface Timer {
  timerRunning: boolean;
  fechainicio: string | null;
  fechafin: string | null;
  starttimernumber: number | null;
  stoptimernumber: number | null;
  operador: null,
  linea: null,
  turno: null,
  maquina: null
}

interface Contador {
  id: number;
  nombre: string;
  valor: number;
  fecha_hora: null;
  operador: string | null;
  linea: string | null;
  turno: string | null;
  maquina: string | null;
}
