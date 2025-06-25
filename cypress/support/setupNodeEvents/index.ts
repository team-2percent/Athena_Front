import MockApiServer from './mockApiServer';
import { unlink } from 'fs/promises';

export const e2eNodeEvents: Cypress.Config['e2e']['setupNodeEvents'] = (on) => {
  const mockApiServer = new MockApiServer();
  
  on('before:run', async () => {
    try {
      await mockApiServer.start();
    } catch (error) {
      console.error('Failed to start mock API server in before:run:', error);
    }
  });
  
  on('after:run', async () => {
    try {
      await mockApiServer.stop();
    } catch (error) {
      console.error('Failed to stop mock API server in after:run:', error);
    }
  });
  
  on('task', {
    async mockApiResponse({ endpoint, data}) {
      try {
        mockApiServer.mockResponse({ endpoint, data });
        return null;
      } catch (error) {
        console.error('Failed to mock API response:', error);
        return null;
      }
    },
    
    async mockApiErrorResponse({ endpoint, message }) {
      try {
        mockApiServer.mockErrorResponse({ endpoint, message });
        return null;
      } catch (error) {
        console.error('Failed to mock API error response:', error);
        return null;
      }
    },
    
    async resetApiMocks() {
      try {
        mockApiServer.reset();
        return null;
      } catch (error) {
        console.error('Failed to reset API mocks:', error);
        return null;
      }
    },

    deleteFile(filename) {
      return unlink(filename)
        .then(() => null)
        .catch(() => null);
    },
  });
}