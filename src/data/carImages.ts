// Every car photo URL lives here so they're easy to swap for real stock photos later.
// Photos are from Unsplash and stand in for each body style, not the exact model.

const unsplash = (id: string) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1200&q=80`;

export const CAR_IMAGES = {
  // Sedans
  camryGray: unsplash("1621007947382-bb3c3994e3fb"),
  sedanNavy: unsplash("1581540222194-0def2dda95b8"),
  sedanBlack: unsplash("1619767886558-efdc259cde1a"),
  corollaWhite: unsplash("1623869675781-80aa31012a5a"),
  sedanSilhouette: unsplash("1485291571150-772bcfc10da5"),
  bmw5Navy: unsplash("1546614042-7df3c24c9e5d"),
  bmw7Gray: unsplash("1601362840469-51e4d8d58785"),

  // SUVs
  gleCoupeWhite: unsplash("1590362891991-f776e747a588"),
  rangeRoverBlack: unsplash("1563720223185-11003d516935"),
  gWagonSilver: unsplash("1520031441872-265e4ff70366"),
  fullSizeWhite: unsplash("1533473359331-0135ef1b58bf"),
  offRoaderBlack: unsplash("1506015391300-4802dc74de2e"),
  crossoverWhite: unsplash("1519641471654-76ce0107ad1b"),
  rav4Silver: unsplash("1617469767053-d3b523a0b982"),
  crossoverBlue: unsplash("1629897048514-3dd7414fe72a"),
  luxurySuvWhite: unsplash("1517524008697-84bbe3c3fd98"),
  compactSilver: unsplash("1609521263047-f8f205293f24"),

  // Coupes
  cClassCoupeGray: unsplash("1514316454349-750a7fd3da3a"),
  coupeBlue: unsplash("1502877338535-766e1452684a"),
  coupeOrange: unsplash("1504215680853-026ed2a45def"),

  // Pickups
  pickupTan: unsplash("1559416523-140ddc3d238c"),
  pickupBlue: unsplash("1551830820-330a71b99659"),

  // Buses
  coachWhite: unsplash("1544620347-c4fd4a3d5957"),
} as const;
