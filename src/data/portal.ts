/**
 * Static reference data for the Krishnagiri District Collectorate command portal.
 * Values mirror the TN e-Governance State Data Center feed (refreshed every 5 mins).
 */

import emblemUrl from '../assets/logo.png'
import portraitUrl from '../assets/person.png'

/** Tamil Nadu state emblem, served from the bundled asset. */
export const EMBLEM_SRC = emblemUrl

/** Official portrait of the District Collector. */
export const PORTRAIT_SRC = portraitUrl

/**
 * The portrait is a wide desk photograph, so any small round chip has to be
 * zoomed and re-centred on the face. Both values are percentages, which keeps
 * the crop identical at every avatar size.
 */
export const PORTRAIT_FACE_CROP = {
  backgroundImage: `url(${portraitUrl})`,
  backgroundSize: '405%',
  backgroundPosition: '52% 51%',
  backgroundRepeat: 'no-repeat',
} as const
