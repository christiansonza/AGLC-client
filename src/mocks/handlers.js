import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('http://localhost:4000/booking', ({ request }) => {
    const url = new URL(request.url);

    if (url.searchParams.get('error') === '401') {
      return new HttpResponse(
        JSON.stringify({ message: 'Unauthorized. Please log in to proceed.' }),
        { status: 401 }
      );
    }

    return HttpResponse.json([
      { id: 1, bookingNumber: 'B001', customerId: 1, remarks: 'Test booking' },
    ]);
  }),

  http.get('http://localhost:4000/customer', () => {
    return HttpResponse.json([{ id: 1, name: 'John', isActive: true }]);
  }),

  http.post('http://localhost:4000/booking', async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({
      message: 'Created Successfully.',
      data: { id: 55, ...body },
    });
  }),
];
