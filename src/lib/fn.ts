const BUS_API = 'http://91.223.13.70'
const TRAM_API = 'http://www.ttss.krakow.pl'

export const selectApiUrl = (bus: boolean) => (bus ? BUS_API : TRAM_API)
