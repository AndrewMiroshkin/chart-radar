#### Для того, щоб запустити веб-додаток необхідно:
1) Скачати образ сервера який надсилає дані
```
   docker pull iperekrestov/university:radar-emulation-service
```

2) Запутити образ та створити контейнер
```
   docker run --name radar-emulator -p 4000:4000 iperekrestov/university:radar-emulation-service
   
   docker start -i radar-emulator
   
   docker stop radar-emulator
```
3) Створюємо перевірочне підключення до WebSocket сервера для перевірки працездатності
```
   wscat -c ws://localhost:4000
```
4) Якщо на попередніх кроках все працювало – запускємо веб-додаток на localhost.
