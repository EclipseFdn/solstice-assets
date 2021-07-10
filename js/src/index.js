/*!
 * Copyright (c) 2021 Eclipse Foundation, Inc.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 *
 * Contributors:
 *   Christopher Guindon <chris.guindon@eclipse-foundation.org>
 *
 * SPDX-License-Identifier: EPL-2.0
 */

// 3rd-party Dependencies
import jquery from 'jquery';
import bootstrap from "bootstrap";
import feather from 'feather-icons'

// API
import eclipseFdnAdopters  from './api/eclipsefdn.adopters'
import eclipseFdnRenderRSS from './api/eclipsefdn.render-rss'
import eclipseFdnApi from './api/jquery.eclipsefdn.api'
//import eclipseFdnIgc from './api/eclipsefdn.igc'

// Bootstrap
import eclipseFdnEventsModal from './bootstrap/eclipsefdn.eventsmodal'
import eclipseFdnBootstrapTables from './bootstrap/eclipsefdn.tables'
import eclipseFdnBootstrapTabs from './bootstrap/eclipsefdn.tabs'
import eclipseFdnBootstrapToggle from './bootstrap/eclipsefdn.toggle'

// Google Tag & Analytics
import eclipseFdnFormAbandonment from './ga/eclipsefdn.form-abandonment'
import eclipseFdnEventTracker from './ga/eclipsefdn.event-tracker';
//import eclipseFdnGoogleTagManager from './ga/eclipsefdn.google-tag-manager';

// Privacy
import eclipseFdnCookieConsent from './privacy/eclipsefdn.cookie-consent'
import eclipseFdnVideos from './privacy/eclipsefdn.videos'

// Solstice
import eclipseFdnMatchHeight from './solstice/eclipsefdn.match-height'
import eclipseFdnSrollUp from './solstice/eclipsefdn.scrollup'
import eclipseFdnSolsticeSidebar from './solstice/eclipsefdn.sidebar'
import eclipseFdnSolsticeSlider from './solstice/eclipsefdn.solstice-slider'
import eclipseFdnSolsticeTemplate from './solstice/eclipsefdn.solstice-template'