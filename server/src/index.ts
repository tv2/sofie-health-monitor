import { eventManager } from './event-manager'

import './consumers'

eventManager.emit('setup', null)

