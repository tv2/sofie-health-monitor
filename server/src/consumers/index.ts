import { register } from '../event-manager'

// Setup web server
import { WebServerConsumer } from './web-server.consumer'
register('setup', new WebServerConsumer())

// Register hosts
import { RegisterHostsConsumer } from './register-hosts.consumer'
register('setup', new RegisterHostsConsumer())

// Collect data / Scraper
import { ScraperConsumer } from './scraper.consumer'
const scraper = new ScraperConsumer({ interval: 30 * 1000 })
register('hosts-registered', scraper)
register('scrape', scraper)

// Process data (diff)
import { HostStateWatcherConsumer } from './host-state-watcher.consumer'
const hostStateWatcherConsumer = new HostStateWatcherConsumer()
register('data', hostStateWatcherConsumer)
register('state-cache-request', hostStateWatcherConsumer)

// Process data to filebeat
import { FilebeatWatcherConsumer } from './filebeat-watcher.consumer'
const filebeatWatcherConsumer = new FilebeatWatcherConsumer()
register('data', filebeatWatcherConsumer)

// Client broadcast
import { ClientBroadcastConsumer } from './client-broadcast.consumer'
const clientBroadcast = new ClientBroadcastConsumer()
register('web-server-started', clientBroadcast)
register('state-changed', clientBroadcast)
register('state-cache', clientBroadcast)
register('state-created', clientBroadcast)
