// Mapping for BOM ftp server files
export const fileMapping = {
  NSW: {
    serverFile: 'IDN65068.xml',
    outputFile: 'nsw.json',
  },
  NT: {
    serverFile: 'IDD10730.xml',
    outputFile: 'nt.json',
  },
  QLD: {
    serverFile: 'IDQ13015.xml',
    outputFile: 'qld.json',
  },
  SA: {
    serverFile: 'IDS10069.xml',
    outputFile: 'sa.json',
  },
  TAS: {
    serverFile: 'IDT13150.xml',
    outputFile: 'tas.json',
  },
  VIC: {
    serverFile: 'IDV18550.xml',
    outputFile: 'vic.json',
  },
  WA: {
    serverFile: 'IDW13050.xml',
    outputFile: 'wa.json',
  },
};

// Mapping for Fire Services urls
export const urlMapping = {
  NSW: 'http://www.rfs.nsw.gov.au/feeds/fdrToban.xml',
  VIC: 'https://data.emergency.vic.gov.au/Show?pageId=getFDRTFBJSON',
  SA: 'http://www.cfs.sa.gov.au/fire_bans_rss/index.jsp',
};
