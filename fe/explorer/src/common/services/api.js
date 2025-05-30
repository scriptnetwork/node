import { httpClient } from './http';
import Raven from 'raven-js';
import dotool from '../../../dotool';

const API_URI = dotool.be_explorer__URL;
const MARKET_URL = dotool.market_api_URL;

export const apiService = {
    get(uri, config = {}) {
        return new Promise((resolve, reject) => {
            return httpClient.get(`${API_URI}/${uri}`, config).then((res) => {
                resolve(res);
            }).catch((err) => {
                if (err.response?.status === 404) {
                    resolve(err.response);
                }
                else {
                    console.log(`ERROR: ${`${API_URI}/${uri}`}. ${err}`);
                    Raven.captureException(err);
                    reject(err);
                }
            });
        });
    },
    delete(uri, config = {}, options = {}) {
        return new Promise((resolve, reject) => {
            httpClient.delete(`${API_URI}/${uri}`, config).then(resolve).catch((err) => {
                console.log(`ERROR: ${`${API_URI}/${uri}`}. ${err}`);
                Raven.captureException(err);
                reject(err);
            });
        });
    },
    post(uri, data = {}, config = {}, options = {}) {
        return new Promise((resolve, reject) => {
            httpClient.post(`${API_URI}/${uri}`, data, config).then(resolve).catch((err) => {
                console.log(`ERROR: ${`${API_URI}/${uri}`}. ${err}`);
                Raven.captureException(err);
                reject(err);
            });
        });
    },
    put(uri, data = {}, config = {}, options = {}) {
        return new Promise((resolve, reject) => {
            httpClient.put(`${API_URI}/${uri}`, data, config).then(resolve).catch((err) => {
                console.log(`ERROR: ${`${API_URI}/${uri}`}.${err}`);
                Raven.captureException(err);
                reject(err);
            });
        });
    }
};

export const apiServiceMarket = {
  get(uri, config = {}) {
    return new Promise((resolve, reject) => {
      return httpClient
        .get(`${MARKET_URL}/${uri}`, config)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          if (err.response?.status === 404) {
            resolve(err.response);
          } else {
            console.log(`ERROR: ${`${MARKET_URL}/${uri}`}. ${err}`);
            Raven.captureException(err);
            reject(err);
          }
        });
    });
  },
}
