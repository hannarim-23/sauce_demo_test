import { test, expect } from '@playwright/test';

test.describe('Набор тестов для проверки основных CRUD-операций @api', () => {
  const baseURL = 'https://restful-booker.herokuapp.com';

  const createBookingData = {
    firstname: 'Sally',
    lastname: 'Brown',
    totalprice: 111,
    depositpaid: true,
    bookingdates: {
      checkin: '2013-02-23',
      checkout: '2014-10-23',
    },
    additionalneeds: 'Breakfast',
  };

  // Функция для создания бронирования
  async function createBooking(request) {
    const response = await request.post(`${baseURL}/booking`, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      data: createBookingData,
    });
    const responseBody = await response.json();
    return {
      bookingId: responseBody.bookingid,
      bookingData: responseBody.booking,
    };
  }

  // Функция для получения токена
  async function getAuthToken(request) {
    const authResponse = await request.post(`${baseURL}/auth`, {
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        username: 'admin',
        password: 'password123',
      },
    });

    expect(authResponse.status()).toBe(200);
    const authBody = await authResponse.json();
    const token = authBody.token;
    expect(token).toBeTruthy();

    return token;
  }

  // функция для проверки данных бронирования
  function validateBookingData(actualData, expectedData) {
    expect(actualData.firstname).toBe(expectedData.firstname);
    expect(actualData.lastname).toBe(expectedData.lastname);
    expect(actualData.totalprice).toBe(expectedData.totalprice);
    expect(actualData.depositpaid).toBe(expectedData.depositpaid);
    expect(actualData.bookingdates.checkin).toBe(expectedData.bookingdates.checkin);
    expect(actualData.bookingdates.checkout).toBe(expectedData.bookingdates.checkout);
    expect(actualData.additionalneeds).toBe(expectedData.additionalneeds);
  }

  test('1. Создание бронирования (Create - POST)', async ({ request }) => {
    const response = await request.post(`${baseURL}/booking`, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      data: createBookingData,
    });

    expect(response.ok()).toBeTruthy();
    // Проверка 1: Статус-код ответа
    expect(response.status()).toBe(200);

    const responseBody = await response.json();

    // Проверка 2: В ответе есть объекты с ключом ‘bookingid’;
    expect(responseBody).toHaveProperty('bookingid');
    const bookingId = responseBody.bookingid;
    console.log(`Создан bookingid: ${bookingId}`);

    // Проверка 3: Данные в ответе соответствуют данным, в первом тесте
    expect(responseBody).toHaveProperty('booking');
    validateBookingData(responseBody.booking, createBookingData);
  });

  test('2. Получение информации о бронировании (Read - GET)', async ({ request }) => {
    // Создаем бронирование
    const { bookingId } = await createBooking(request);
    console.log(`Создан bookingid: ${bookingId}`);

    // Отправляем GET запрос для получения информации о бронировании
    const response = await request.get(`${baseURL}/booking/${bookingId}`, {
      headers: {
        Accept: 'application/json',
      },
    });

    // Проверка 1: Статус-код ответа равен 200 OK
    console.log(`Статус-код: ${response.status()}`);
    expect(response.status()).toBe(200);

    // Получаем тело ответа
    const responseBody = await response.json();
    console.log('Тело ответа:', responseBody);

    validateBookingData(responseBody, createBookingData);
    console.log('✅ Данные получены корректно');
  });


  test('3. Обновление бронирования (Update - PUT)', async ({ request }) => {
    console.log('=== Тест 3: Обновление бронирования ===');

    // Создаем бронирование
    const { bookingId } = await createBooking(request);
    console.log(`Создан bookingid: ${bookingId}`);

    // Получаем токен авторизации
    const authToken = await getAuthToken(request);
    console.log(`Получен токен: ${authToken}`);

    // Создаем данные для обновления
    const updateData = {
      ...createBookingData,
      firstname: 'Jane',
      totalprice: 222,
    };

    // Отправляем PUT запрос для обновления бронирования
    const response = await request.put(`${baseURL}/booking/${bookingId}`, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Cookie: `token=${authToken}`,
      },
      data: updateData,
    });

    // Статус-код ответа равен 200 OK
    expect(response.status()).toBe(200);

    // Получаем тело ответа
    const updatedData = await response.json();
    console.log('Тело ответа:', updatedData);

    // Проверяем изменения
    expect(updatedData.firstname).toBe('Jane');
    expect(updatedData.totalprice).toBe(222);
    // Проверяем что остальное без изменений
    expect(updatedData.lastname).toBe('Brown');
    expect(updatedData.depositpaid).toBe(true);
  });

  test('4. Удаление бронирования (Delete - DELETE)', async ({ request }) => {
    console.log('=== Тест 4: Удаление бронирования ===');

    // Создаем бронирование для удаления
    const { bookingId } = await createBooking(request);
    console.log(`Создан bookingid для удаления: ${bookingId}`);

    // Получаем токен авторизации
    const authToken = await getAuthToken(request);
    console.log(`Получен токен: ${authToken}`);

    // Отправляем DELETE запрос для удаления бронирования
    const response = await request.delete(`${baseURL}/booking/${bookingId}`, {
      headers: {
        'Content-Type': 'application/json',
        Cookie: `token=${authToken}`,
      },
    });

    // Статус-код ответа равен 201 Created
    console.log(`Статус-код при удалении: ${response.status()}`);
    expect(response.status()).toBe(201);

    // Попробуем получить удаленное бронирование
    const getResponse = await request.get(`${baseURL}/booking/${bookingId}`, {
      headers: {
        Accept: 'application/json',
      },
    });

    // Проверяем, что сервер отвечает со статус-кодом 404 Not Found
    console.log(`Статус-код после удаления: ${getResponse.status()}`);
    expect(getResponse.status()).toBe(404);
  });
});
