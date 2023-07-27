import { Component, NgZone, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';

interface Timer {
  timerRunning: boolean;
  fechainicio: string | null;
  fechafin: string | null;
  starttimernumber: number | null;
  stoptimernumber: number | null;
  operador: string | null;
  linea: string | null;
  turno: string | null;
  maquina: string | null;
}

interface Contador {
  id: number;
  nombre: string;
  valor: number;
  fecha_hora: string | null;
  operador: string | null;
  linea: string | null;
  turno: string | null;
  maquina: string | null;
}

interface SelectorData {
  operador: string | null;
  linea: string | null;
  turno: string | null;
  maquina: string | null;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit, OnDestroy {
  operador: string | null = null;
  linea: string | null = null;
  turno: string | null = null;
  maquina: string | null = null;
  eventos: any[] = [];
  selectedOperador: string | null = null;
  selectedLinea: string | null = null;
  selectedTurno: string | null = null;
  selectedMaquina: string | null = null;
  private selectedOperadorTemp: string | null = null;
  private selectedLineaTemp: string | null = null;
  private selectedTurnoTemp: string | null = null;
  private selectedMaquinaTemp: string | null = null;


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
    camion: {
      id: 0,
      nombre: 'camion',
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
    },


  };

  consoleLogs: string[] = [];  // DATOS PARA MOSTRAR 
  timers2: { id: number; nombre: string; timer: Timer }[] = [];
  timers2Counter: number = 0;
  contadores2: { id: number; nombre: string; valor: number; fecha_hora: string; operador: string | null; linea: string | null; maquina: string | null; turno: string | null; }[] = []; contadores2Counter: number = 0;

  intervalIds: { [key: string]: any } = {};  //se cambio de NUMBER a ANY
  currentDateTime: string = '';
  showClock: boolean = false;
  contadorBiTrenGlobulus: number = 0;
  contadorBiTrenNitens: number = 0;
  camion: number = 0;

  lastClickButtons: { [key: string]: number } = {};

  constructor(private ngZone: NgZone,
    private cdr: ChangeDetectorRef
    //,    private dialog: MatDialog
  ) { }


  toggleTimer(timerName: string): void {
    const timer = this.timers[timerName];
  
    // Verificar si todos los campos están seleccionados
    const operador = this.operador;
    const maquina = this.maquina;
    const linea = this.linea;
    const turno = this.turno;
  
    if (!operador || !maquina || !linea || !turno) {
      alert('Debes seleccionar operador, máquina, línea y turno antes de iniciar el temporizador.');
      return;
    }
  
    if (!timer.timerRunning) {
      // Obtener la fecha y hora de inicio del timer
      const startTime = new Date();
      const formattedStartTime = this.formatDateTime(startTime);
  
      // Actualizar el objeto del timer
      timer.timerRunning = true;
      timer.fechainicio = formattedStartTime;
      timer.starttimernumber = startTime.getTime(); // Guardar el tiempo en milisegundos
  
      // Buscar si ya existe un timer con el mismo nombre en timers2
      const existingTimerIndex = this.timers2.findIndex((timerItem) => timerItem.nombre === timerName);
  
      if (existingTimerIndex !== -1) {
        // Si ya existe, actualizar el valor del timer en timers2
        this.timers2[existingTimerIndex].timer = {
          timerRunning: timer.timerRunning,
          fechainicio: timer.fechainicio,
          fechafin: timer.fechafin,
          starttimernumber: timer.starttimernumber,
          stoptimernumber: timer.stoptimernumber,
          operador: operador,
          linea: linea,
          turno: turno,
          maquina: maquina,
        };
      } else {
        // Si no existe, agregar un nuevo timer a timers2
        this.timers2Counter++;
        this.timers2.push({
          id: this.timers2Counter,
          nombre: timerName,
          timer: {
            timerRunning: timer.timerRunning,
            fechainicio: timer.fechainicio,
            fechafin: timer.fechafin,
            starttimernumber: timer.starttimernumber,
            stoptimernumber: timer.stoptimernumber,
            operador: operador,
            linea: linea,
            turno: turno,
            maquina: maquina,
          },
        });
      }
  
      this.exportDataToJsonNew(); // Guardar los cambios en el JSON
    } else {
      // Detener el temporizador y guardar los cambios en el JSON
      this.stopTimer(timerName);
    }
  }
  

  stopTimer(timerName: string): void {
    // Verificar si el timer está en funcionamiento
    if (this.timers[timerName].timerRunning) {
      // Obtener la fecha y hora de finalización del timer
      const stopTime = new Date();
      const formattedStopTime = this.formatDateTime(stopTime);

      // Actualizar el objeto del timer
      this.timers[timerName].timerRunning = false;
      this.timers[timerName].fechafin = formattedStopTime;
      this.timers[timerName].stoptimernumber = stopTime.getTime(); // Guardar el tiempo en milisegundos

      // Guardar en el arreglo de eventos
      // Verificar si todos los campos están seleccionados
      const operador = this.operador;
      const maquina = this.maquina;
      const linea = this.linea;
      const turno = this.turno;


      this.timers2Counter++;
      this.timers2.push({
        id: this.timers2Counter,
        nombre: timerName,
        timer: {
          timerRunning: this.timers[timerName].timerRunning,
          fechainicio: this.timers[timerName].fechainicio,
          fechafin: this.timers[timerName].fechafin,
          starttimernumber: this.timers[timerName].starttimernumber,
          stoptimernumber: this.timers[timerName].stoptimernumber,
          operador: operador,
          linea: linea,
          turno: turno,
          maquina: maquina,
        },
      });

      this.exportDataToJsonNew(); // Guardar los cambios en el JSON
    }
  }



  removeLastStopTime(timerName: string): void {
    const timer = this.timers[timerName];
    const contadorIndex = this.contadores2.findIndex(c => c.nombre === timerName);

    if (contadorIndex !== -1) {
      this.contadores2[contadorIndex].fecha_hora = this.contadores2[contadorIndex].fecha_hora.replace(/ \d{2}:\d{2}:\d{2}$/, '');
      this.exportDataToJsonNew();
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
  // Resetea los contadores a las 00:00
  checkAndResetCounters(): void {
    const currentTime = new Date();
    const currentHour = currentTime.getHours();
    const currentMinutes = currentTime.getMinutes();
    const currentSeconds = currentTime.getSeconds();

    if (currentHour === 0 && currentMinutes === 0) {
      // Es medianoche, reiniciar los contadores
      this.contadorBiTrenGlobulus = 0;
      this.contadorBiTrenNitens = 0;
      this.camion = 0;

      // Guardar los cambios en el JSON
      this.saveCounterChanges('biTrenGlobulus');
      this.saveCounterChanges('biTrenNitens');
      this.saveCounterChanges('camion');

      console.log('¡Contadores reiniciados a la medianoche!');
    }
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

    // Obtener los valores de los selectores
    const operador = this.operador ? this.operador : null;
    const linea = this.linea ? this.linea : null;
    const turno = this.turno ? this.turno : null;
    const maquina = this.maquina ? this.maquina : null;

    // Agregar el contador a contadores2 con la fecha del clic y los valores de los selectores
    this.contadores2Counter++;
    this.contadores2.push({
      id: this.contadores2Counter,
      nombre: contador,
      valor: this.getContadorValue(contador),
      fecha_hora: formattedDateTime,
      operador: operador,
      linea: linea,
      turno: turno,
      maquina: maquina,
    });
  }

  isAnyCounterDecreased(): boolean {
    return (
      this.contadorBiTrenGlobulus < 0 ||
      this.contadorBiTrenNitens < 0 ||
      this.camion < 0
    );
  }

  // Nueva función para guardar los cambios en el JSON cada vez que se modifiquen los contadores
  saveCounterChanges(contador: string): void {
    const contadorIndex = this.contadores2.findIndex(c => c.nombre === contador);
    if (contadorIndex !== -1) {
      // Obtener los valores de los selectores
      const operador = this.operador ? this.operador : null;
      const linea = this.linea ? this.linea : null;
      const turno = this.turno ? this.turno : null;
      const maquina = this.maquina ? this.maquina : null;

      // Actualizar los valores de los selectores en el contador correspondiente
      this.contadores2[contadorIndex].operador = operador;
      this.contadores2[contadorIndex].linea = linea;
      this.contadores2[contadorIndex].turno = turno;
      this.contadores2[contadorIndex].maquina = maquina;

      this.exportDataToJsonNew(); // Guardar los cambios en el JSON
    }
  }

  lastClickTime: { [key: string]: number } = {};

  confirmarRestar(contador: string): void {
    const operador = this.operador;
    const maquina = this.maquina;
    const linea = this.linea;
    const turno = this.turno;

    if (!operador || !maquina || !linea || !turno) {
      alert('Debes seleccionar operador, máquina, línea y turno antes de iniciar el temporizador.');
      return;
    }
    const confirmation = confirm('¿Estás seguro de querer restar el contador?');
    if (confirmation) {
      // Restar el contador apropiado según el caso
      switch (contador) {
        case 'biTrenGlobulus':
          if (this.contadorBiTrenGlobulus > 0) {
            this.contadorBiTrenGlobulus--;
            console.log('Contador BiTren Globulus restado');
            this.saveCounterChanges(contador); // Guardar los cambios en el JSON
          }
          break;
        case 'biTrenNitens':
          if (this.contadorBiTrenNitens > 0) {
            this.contadorBiTrenNitens--;
            console.log('Contador BiTren Nitens restado');
            this.saveCounterChanges(contador); // Guardar los cambios en el JSON
          }
          break;
        case 'camion':
          if (this.camion > 0) {
            this.camion--;
            console.log('Contador Camion restado');
            this.saveCounterChanges(contador); // Guardar los cambios en el JSON
          }
          break;
        default:
          break;
      }

      // Establecer la marca de tiempo en 2 minutos (120,000 milisegundos) desde el tiempo actual
      const currentTime = Date.now();
      this.lastClickTime[contador] = currentTime - 120000;
    }
    this.exportDataToJsonNew();
  }

  aumentarUno(contador: string): void {
    // Check if all selectors are selected
    if (!this.operador || !this.maquina || !this.linea || !this.turno) {
      alert('Debes seleccionar operador, máquina, línea y turno antes de iniciar el temporizador.');
      return;
    }

    // Check if any timer is running
    if (this.isAnyTimerRunning()) {
      alert('No puedes aumentar el contador si la línea está detenida');
      return;
    }

    // Get the current time
    const currentTime = Date.now();

    // Check if at least 2 minutes have passed since the last increase or decrease
    const lastClick = this.lastClickTime[contador] || 0;
    const timeDiff = currentTime - lastClick;
    const minTimeDifference = 2 * 60 * 1000; // 2 minutes in milliseconds

    if (timeDiff < minTimeDifference) {
      const remainingTime = (minTimeDifference - timeDiff) / 1000; // Convert to seconds
      alert(`Debes esperar al menos ${remainingTime} segundos antes de poder aumentar este contador.`);
      return;
    }

    // Increment the appropriate counter based on the case
    switch (contador) {
      case 'biTrenGlobulus':
        this.contadorBiTrenGlobulus++;
        console.log('Contador BiTren Globulus aumentado');
        break;
      case 'biTrenNitens':
        this.contadorBiTrenNitens++;
        console.log('Contador BiTren Nitens aumentado');
        break;
      case 'camion':
        this.camion++;
        console.log('Contador Camion aumentado');
        break;
      default:
        break;
    }

    // Update the timestamp only when a valid increase occurs
    this.lastClickTime[contador] = currentTime;

    // Save the current selector values to the JSON
    const operador = this.operador;
    const maquina = this.maquina;
    const linea = this.linea;
    const turno = this.turno;

    const formattedDateTime = this.formatDateTime(new Date());

    this.contadores2Counter++;
    this.contadores2.push({
      id: this.contadores2Counter,
      nombre: contador,
      valor: this.getContadorValue(contador),
      fecha_hora: formattedDateTime,
      operador: operador,
      linea: linea,
      turno: turno,
      maquina: maquina,
    });

    this.exportDataToJsonNew(); // Save changes to JSON
  }


  getContadorValue(contador: string): number {
    switch (contador) {
      case 'biTrenGlobulus':
        return this.contadorBiTrenGlobulus;

      case 'biTrenNitens':
        return this.contadorBiTrenNitens;

      case 'camion':
        return this.camion;
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

      case 'camion':
        return 'Camión';

      default:
        return '';
    }
  }

  getTotalContador(): number {
    return this.contadorBiTrenGlobulus + this.contadorBiTrenNitens + this.camion;
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

  exportDataToJsonNew(): void {
    const totalContadorId = this.contadores2Counter + 1;
  
    // Objeto auxiliar para almacenar todos los posibles objetos de timers con valores nulos
    const timersUnique: { [key: string]: { id: number; nombre: string; timer: Timer } } = {};
  
    // Recorrer contadores y crear objetos con valores nulos si no existen
    Object.keys(this.timers).forEach((timerName) => {
      const timer = this.timers[timerName];
      timersUnique[timerName] = {
        id: 0,
        nombre: timerName,
        timer: {
          timerRunning: false,
          fechainicio: null,
          fechafin: null,
          starttimernumber: null,
          stoptimernumber: null,
          operador: null,
          linea: null,
          turno: null,
          maquina: null,
        },
      };
    });
  
    // Recorrer timers2 y actualizar el objeto auxiliar con el último valor para cada timer
    this.timers2.forEach((timer) => {
      const { nombre, id, timer: timerData } = timer;
      timersUnique[nombre] = { id, nombre, timer: { ...timerData } };
    });
  
    // Generar el array de timersData a partir del objeto auxiliar
    const timersData = Object.values(timersUnique);
  
    // Objeto auxiliar para almacenar todos los posibles objetos de contadores con valores nulos
    const contadoresUnique: { [key: string]: Contador } = {};
  
    // Recorrer contadores y crear objetos con valores nulos si no existen
    Object.keys(this.contadores).forEach((contadorName) => {
      const contador = this.contadores[contadorName];
      contadoresUnique[contadorName] = {
        id: 0,
        nombre: contadorName,
        valor: 0,
        fecha_hora: null,
        operador: null,
        linea: null,
        turno: null,
        maquina: null,
      };
    });
  
    // Recorrer contadores2 y actualizar el objeto auxiliar con el último valor para cada contador
    this.contadores2.forEach((contador) => {
      contadoresUnique[contador.nombre] = { ...contador };
    });
  
    // Generar el array de contadoresData a partir del objeto auxiliar
    const contadoresData = Object.values(contadoresUnique);
  
    const data = {
      timers: timersData,
      contadores: contadoresData,
      totalContador: {
        id: totalContadorId,
        valor: this.getTotalContador(),
      },
    };
  
    const jsonData = JSON.stringify(data);
    console.log(jsonData);
  
  }
  
  isAnyTimerRunning(): boolean {
    for (const timerName in this.timers) {
      if (this.timers[timerName].timerRunning) {
        return true;
      }
    }
    return false;
  }

  ngOnInit(): void {
    this.updateClock();
    // Ejecutar checkAndResetCounters() cada 50 segundos
    setInterval(() => {
      this.checkAndResetCounters();
    }, 30000); // 50000 milisegundos = 50 segundos
  }

  ngOnDestroy(): void {
    window.cancelAnimationFrame(this.intervalIds['clock']);
  }

}



