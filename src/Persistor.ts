import Log from './Log';
import Storage from './Storage';
import Cache from './Cache';

import { ApolloPersistOptions } from './types';

export interface PersistorConfig<T> {
  log: Log<T>;
  cache: Cache<T>;
  storage: Storage<T>;
}

export default class Persistor<T> {
  log: Log<T>;
  cache: Cache<T>;
  storage: Storage<T>;
  maxSize?: number;
  paused: boolean;

  constructor(
    { log, cache, storage }: PersistorConfig<T>,
    options: ApolloPersistOptions<T>,
  ) {
    const { maxSize = 1024 * 1024 } = options;

    this.log = log;
    this.cache = cache;
    this.storage = storage;
    this.paused = false;

    if (maxSize) {
      this.maxSize = maxSize;
    }
  }

  async persist(): Promise<void> {
    try {
      const data = this.cache.extract(); // cache read from memory

      if (
        this.maxSize != null &&
        typeof data === 'string' &&
        data.length > this.maxSize &&
        !this.paused
      ) {
        await this.purge(); // purge cache from async storage

        const parsedData = JSON.parse(data); // parse data

        const {
          ROOT_QUERY: {
            accessToken = '',
            playerId = '',
            gender = '',
            teamId = '',
            authServerId = '',
            email = '',
            myLatitude = 0.0,
            myLongitude = 0.0,
            isEmailVerified = false,
            refreshToken = null,
            ftuWelcomeToMatchbase = false,
          },
        } = parsedData; // extract local storage items

        const essentialData = {
          ROOT_QUERY: {
            accessToken,
            playerId,
            gender,
            teamId,
            authServerId,
            email,
            myLatitude,
            myLongitude,
            isEmailVerified,
            refreshToken,
            ftuWelcomeToMatchbase,
          },
        }; // create essential data for new cache

        const essentialJson = JSON.stringify(essentialData); // stringify essential data

        await this.storage.write(essentialJson); // write essential JSON to storage
        await this.cache.restore(essentialJson); // write essential JSON to memory

        this.paused = true; // pause cache persistor
        return;
      }

      if (this.paused) {
        this.paused = false;
      }

      await this.storage.write(data); // write cache from memory in async storage

      this.log.info(
        typeof data === 'string'
          ? `Persisted cache of size ${data.length} characters`
          : 'Persisted cache',
      );
    } catch (error) {
      this.log.error('Error persisting cache', error);
      throw error;
    }
  }

  async restore(): Promise<void> {
    try {
      const data = await this.storage.read();
      if (data != null) {
        await this.cache.restore(data);
        this.log.info(
          typeof data === 'string'
            ? `Restored cache of size ${data.length} characters`
            : 'Restored cache',
        );
      } else {
        this.log.info('No stored cache to restore');
      }
    } catch (error) {
      this.log.error('Error restoring cache', error);
      throw error;
    }
  }

  async purge(): Promise<void> {
    try {
      await this.storage.purge();
      this.log.info('Purged cache storage');
    } catch (error) {
      this.log.error('Error purging cache storage', error);
      throw error;
    }
  }
}
