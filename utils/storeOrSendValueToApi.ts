import { filterSubmittingValues } from './filterSubmittingValues';

const setCookie = (name: string, value: any) => {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=${encodeURIComponent(JSON.stringify(value))};path=/`;
};

const methodDetector = (method: 'UPSERT' | 'INSERT' | 'CREATE' | 'DELETE') => {
  switch (method) {
    case 'CREATE':
      return 'POST';
    case 'INSERT':
      return 'POST';
    case 'DELETE':
      return 'DELETE';
    case 'UPSERT':
      return 'PUT';
  }
};

export const storeOrSendValueToApi = async ({ data, values }: { data: any; values: any }) => {
  // Handle storage (cookies, localStorage, sessionStorage)
  if (data.store) {
    switch (data.store) {
      case 'cookies':
        setCookie(data.key_name, values);
        break;
      case 'localStorage':
        localStorage.setItem(data.key_name, JSON.stringify(values));
        break;
      case 'sessionStorage':
        sessionStorage.setItem(data.key_name, JSON.stringify(values));
        break;
      default:
        sessionStorage.setItem(data.key_name, JSON.stringify(values));
        break;
    }
  }

  // Handle API endpoint
  if (data.endPoint) {
    try {
      const response = await fetch(data.endPoint, {
        method: methodDetector(data?.method) || 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(filterSubmittingValues(values))
      });

      if (!response.ok) {
        throw new Error('Failed to store or send data to API');
      }

      // Handle response as needed
      const responseData = await response.json();
      console.log('API response:', responseData);
    } catch (error) {
      console.error('Error storing or sending data to API:', error);
      throw error; // Propagate error further if needed
    }
  }
};
