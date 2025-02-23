import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const refs = {
  dateInput: document.querySelector('#datetime-picker'),
  startBtn: document.querySelector('[data-start]'),
  days: document.querySelector('[data-days]'),
  hours: document.querySelector('[data-hours]'),
  minutes: document.querySelector('[data-minutes]'),
  seconds: document.querySelector('[data-seconds]'),
};

let userSelectedDate = null;
let timerId = null;
refs.startBtn.disabled = true;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    
    const selectedDate = selectedDates[0];
    if (selectedDate <= new Date()) {
      iziToast.error({
        title: 'Error',
        message: 'Please choose a date in the future',
      });
      refs.startBtn.disabled = true;
    } else {
      userSelectedDate = selectedDate;
      refs.startBtn.disabled = false;
    }
  },
};

flatpickr(refs.dateInput, options);

const convertMs = ms => {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  return {
    days: Math.floor(ms / day),
    hours: Math.floor((ms % day) / hour),
    minutes: Math.floor((ms % hour) / minute),
    seconds: Math.floor((ms % minute) / second),
  };
};

const addLeadingZero = value => String(value).padStart(2, '0');

const updateTimerDisplay = ({ days, hours, minutes, seconds }) => {
  refs.days.textContent = addLeadingZero(days);
  refs.hours.textContent = addLeadingZero(hours);
  refs.minutes.textContent = addLeadingZero(minutes);
  refs.seconds.textContent = addLeadingZero(seconds);
};

const updateTimer = () => {
  const currentTime = new Date();
  const timeLeft = userSelectedDate - currentTime;

  if (timeLeft <= 0) {
    clearInterval(timerId);
    refs.dateInput.disabled = false;
    refs.startBtn.disabled = true;
    updateTimerDisplay({ days: 0, hours: 0, minutes: 0, seconds: 0 });
     
    return;
  }

  updateTimerDisplay(convertMs(timeLeft));
};

refs.startBtn.addEventListener('click', () => {
  refs.startBtn.disabled = true;
  refs.dateInput.disabled = true;
  
  updateTimer();
  timerId = setInterval(updateTimer, 1000);
});