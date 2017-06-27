
const areas = {
  NSW: ['Far North Coast', 'North Coast', 'Greater Hunter', 'Greater Sydney Region', 'Illawara/Shoalhaven', 'Far South Coast',
    'Monaro Alpine', 'ACT', 'Southern Ranges', 'Central Ranges', 'New England', 'Northern Slopes', 'North Western',
    'Upper Central West Plains', 'Lower Central West Plains', 'Southern Slopes', 'Eastern Riverina', 'Southern Riverina',
    'Northern Riverina', 'South Western', 'Far Western'],
  VIC: ['Mallee', 'Wimmera', 'South West', 'Northern Country', 'North Central',
    'Central', 'North East', 'East Gippsland', 'West and South Gippsland'],
  'SA': ['Adelaide Metropolitan', 'Mount Lofty Ranges', 'Kangaroo Island', 'Mid North', 'Yorke Peninsula', 'Murraylands',
    'Riverland', 'Upper South East', 'Lower South East', 'Flinders', 'North East Pastoral', 'Eastern Eyre Peninsula',
    'North West Pastoral', 'Lower Eyre Peninsula', 'West Coast'],
};

const councilsNSW = {
  'Far North Coast': ['Ballina', 'Byron', 'Clarence Valley', 'Kyogle', 'Lismore', 'Richmond Valley', 'Tweed'],
  'North Coast': ['Bellingen', 'Coffs Harbour', 'Gloucester', 'Greater Taree', 'Great Lakes',
    'Port Macquarie-Hastings', 'Kempsey', 'Nambucca'],
  'Greater Hunter': ['Cessnock', 'Dungog', 'Lake Macquarie', 'Maitland', 'Muswellbrook', 'Newcastle',
    'Port Stephens', 'Singleton', 'Upper Hunter'],
  'Greater Sydney Region': ['Ashfield', 'Auburn', 'Bankstown','The Hills', 'Blacktown', 'Blue Mountains', 'Botany Bay',
    'Burwood', 'Camden', 'Campbelltown', 'Canada Bay', 'Canterbury', 'Fairfield', 'Gosford', 'Hawkesbury',
    'Holroyd', 'Hornsby', 'Hunters Hill', 'Hurstville', 'Kogarah', 'Ku-Ring-Gai', 'Lane Cove', 'Leichhardt',
    'Liverpool', 'Manly', 'Marrickville', 'Mosman', 'North Sydney', 'Parramatta', 'Penrith', 'Pittwater',
    'Randwick', 'Rockdale', 'Ryde', 'Strathfield', 'Sutherland', 'Sydney', 'Warringah', 'Waverley', 'Willoughby',
    'Woollahra', 'Wyong'],
  'Illawara/Shoalhaven': ['Kiama', 'Shellharbour', 'Shoalhaven', 'Wingecarribee', 'Wollondilly', 'Wollongong'],
  'Far South Coast': ['Bega Valley', 'Eurobodalla'],
  'Monaro Alpine': ['Bombala', 'Cooma-Monaro', 'Snowy River'],
  'ACT': [],
  'Southern Ranges': ['Goulburn Mulwaree', 'Palerang', 'Queanbeyan', 'Upper Lachlan', 'Yass Valley'],
  'Central Ranges': ['Bathurst', 'Blayney', 'Cabonne', 'Cowra', 'Lithgow', 'Mid-Western', 'Oberon', 'Orange'],
  'New England': ['Armidale Dumaresq', 'Glen Innes Severn', 'Guyra', 'Tenterfield', 'Uralla', 'Walcha'],
  'Northern Slopes': ['Gunnedah', 'Gwydir', 'Inverell', 'Liverpool Plains', 'Tamworth'],
  'North Western': ['Moree Plains', 'Narrabri', 'Walgett', 'Warrumbungle'],
  'Upper Central West Plains':['Bogan', 'Coonamble', 'Gilgandra', 'Warren'],
  'Lower Central West Plains': ['Bland', 'Dubbo', 'Forbes', 'Lachlan', 'Narromine', 'Parkes', 'Temora', 'Weddin', 'Wellington'],
  'Southern Slopes': ['Boorowa', 'Cootamundra', 'Gundagai', 'Harden', 'Tumbarumba', 'Tumut', 'Young'],
  'Eastern Riverina': ['Albury', 'Coolamon', 'Greater Hume', 'Junee', 'Lockhart', 'Wagga Wagga'],
  'Southern Riverina': ['Berrigan', 'Conargo', 'Corowa', 'Deniliquin', 'Jerilderie', 'Murray', 'Urana', 'Wakool'],
  'Northern Riverina': ['Carrathool', 'Griffith', 'Hay', 'Leeton', 'Murrumbidgee', 'Narrandera'],
  'South Western': ['Balranald', 'Wentworth'],
  'Far Western': ['Bourke', 'Brewarrina', 'Broken Hill', 'Central Darling', 'Cobar'],
};

const councilsVIC = {
  'Mallee': ['Buloke', 'Gannawarra', 'Mildura', 'Swan Hill', 'Yarriambiack Shire North'],
  'Wimmera': ['Hindmarsh Shire', 'Horsham Rural City', 'Northern Grampians Shire', 'West Wimmera Shire', 'Yarriambiack'],
  'South West': ['Ararat', 'Colac Otway', 'Corangamite', 'Glenelg', 'Moyne', 'Pyrenees','Southern Grampians', 'Warrnambool'],
  'Northern Country': ['Campaspe', 'Greater Bendigo', 'Greater Shepparton', 'Loddon', 'Moira ','Strathbogie'],
  'North Central': ['Central Goldfields', 'Lake Mountain Alpine Resort (Unincorporated)', 'Mitchell', 'Mount Alexander','Murrindindi'],
  'Central': ['Ballarat', 'Banyule', 'Bass Coast', 'Bayside', 'Boroondara', 'Brimbank', 'Cardinia','Casey', 'Darebin', 'Frankston',
    'French-Elizabeth-Sandstone Islands (Unincorporated)', 'Glen Eira', 'Golden Plains', 'Greater Dandenong', 'Greater Geelong',
    'Hepburn', 'Hobsons Bay', 'Hume', 'Kingston', 'Knox', 'Macedon Ranges', 'Manningham', 'Maribyrnong', 'Maroondah', 'Melbourne',
    'Melton', 'Monash', 'Moonee Valley', 'Moorabool', 'Moreland', 'Mornington Peninsula', 'Nillumbik', 'Port Phillip',
    'Queenscliffe', 'Stonnington', 'Surf Coast', 'Whitehorse', 'Whittlesea', 'Wyndham', 'Yarra', 'Yarra Ranges'],
  'North East': ['Alpine', 'Benalla', 'Falls Creek', 'Indigo', 'Mansfield', 'Mount Buller', 'Mount Hotham Alpine Resort (Unincorporated)',
    'Mount Stirling Alpine Resort (Unincorporated)', 'Towong', 'Wangaratta', 'Wodonga'],
  'East Gippsland': ['East Gippsland'],
  'West and South Gippsland': ['Baw Baw', 'Latrobe', 'Mount Baw Baw Alpine Resort (Unincorporated)', 'South Gippsland', 'Wellington'],
};

const councilsSA = {
  'Adelaide Metropolitan': ['Adelaide', 'Burnside', 'Campbelltown', 'Charles Sturt', 'Holdfast Bay', 'Marion', 'Norwood Payneham and St Peters',
    'Onkaparinga', 'Playford', 'Port Adelaide Enfield', 'Prospect', 'Salisbury', 'Tea Tree Gully', 'Unley', 'Walkerville', 'West Torrens'],
  'Mount Lofty Ranges': ['Adelaide Hills', 'Alexandrina', 'Barossa', 'Burnside', 'Campbelltown', 'Gawler', 'Mitcham', 'DC of Mount Barker', 'Onkaparinga',
    'Playford', 'Salisbury', 'Tea Tree Gully', 'Victor Harbor', 'DC of Yankalilla'],
  'Kangaroo Island': ['Kangaroo Island'],
  'Mid North': ['Clare and Gilbert Valleys', 'Goyder', 'Light', 'DC of Mallala', 'Northern Areas', 'Port Pirie', 'Wakefield'],
  'Yorke Peninsula': ['DC of Barunga West', 'DC of the Copper Coast', 'Yorke Peninsula'],
  'Murraylands': ['Karoonda East Murray', 'Mid Murray', 'Murray Bridge', 'Renmark Paringa', 'Southern Mallee', 'The Coorong'],
  'Riverland': ['Loxton Waikerie', 'Mid Murray', 'Renmark Paringa', 'Berri Barmera'],
  'Upper South East': ['Coorong', 'DC of Tatiara'],
  'Lower South East': ['Grant', 'Kingston', 'DC of Kingston', 'Mount Gambier', 'Naracoorte and Lucindale', 'Robe', 'Wattle Range'],
  'Flinders': ['Flinders Ranges', 'Mount Remarkable', 'Orroroo Carrieton', 'Peterborough', 'Port Augusta'],
  'North East Pastoral': ['Leigh Creek', 'Lyndhurst', 'Arkaroola', 'Moomba', 'Innamincka'],
  'Eastern Eyre Peninsula': ['Cleve', 'Franklin Harbour', 'Kimba', 'Whyalla'],
  'North West Pastoral': ['Coober Pedy', 'Roxby Downs', 'Woomera', 'Glendambo', 'Andamooka', 'Marla', 'Mintabie', 'Ernabella'],
  'Lower Eyre Peninsula': ['Lower Eyre Peninsula', 'Tumby Bay', 'City of Port Lincoln'],
  'West Coast': ['Ceduna', 'Elliston', 'Wudinna', 'Streaky Bay'],
};

// TODO (Port) Wakefield

const fallbackSA = {
  'Roxby Downs': ['Marree', 'William Creek', 'Oodnadatta'],
  'Wakefield': ['Balaklava', 'Blyth', 'Snowtown', 'Owen', 'Hamley Bridge', 'Brinkworth', 'Lochiel', 'Port Wakefield'],

}

// const councilsVIC = {
//   'Mallee': ['Buloke Shire', 'Gannawarra Shire', 'Mildura Rural City', 'Swan Hill Rural City', 'Yarriambiack Shire North'],
//   'Wimmera': ['Hindmarsh Shire', 'Horsham Rural City', 'Northern Grampians Shire', 'West Wimmera Shire', 'Yarriambiack Shire South'],
//   'South West': ['Ararat Rural City', 'Colac Otway Shire', 'Corangamite Shire', 'Glenelg Shire', 'Moyne Shire', 'Pyrenees Shire',
//     'Southern Grampians Shire', 'Warrnambool City'],
//   'Northern Country': ['Campaspe Shire', 'Greater Bendigo City', 'Greater Shepparton City', 'Loddon Shire', 'Moira Shire',
//     'Strathbogie Shire'],
//   'North Central': ['Central Goldfields Shire', 'Lake Mountain Alpine Resort', 'Mitchell Shire', 'Mount Alexander Shire',
//     'Murrindindi Shire'],
//   'Central': ['Ballarat City', 'Banyule City', 'Bass Coast Shire', 'Bayside City', 'Boroondara City', 'Brimbank City', 'Cardinia Shire',
//     'Casey City', 'Darebin City', 'Frankston City', 'French Island', 'Glen Eira City', 'Golden Plains Shire', 'Greater Dandenong City',
//     'Greater Geelong City', 'Hepburn Shire', 'Hobsons Bay City', 'Hume City', 'Kingston City', 'Knox City', 'Macedon Ranges Shire',
//     'Manningham City', 'Maribyrnong City', 'Maroondah City', 'Melbourne City', 'Melton Shire', 'Monash City', 'Moonee Valley City',
//     'Moorabool Shire', 'Moreland City', 'Mornington Peninsula Shire', 'Nillumbik Shire', 'Port Phillip City', 'Queenscliffe Borough',
//     'Stonnington City', 'Surf Coast Shire', 'Whitehorse City', 'Whittlesea City', 'Wyndham City', 'Yarra City', 'Yarra Ranges Shire'],
//   'North East': ['Alpine Shire', 'Benalla Rural City', 'Falls Creek Alpine Resort', 'Indigo Shire', 'Mansfield Shire', 'Mount Buller Alpine Resort',
//     'Mount Hotham Alpine Resort', 'Mount Stirling Alpine Resort', 'Towong Shire', 'Wangaratta Rural City', 'Wodonga City'],
//   'East Gippsland': ['East Gippsland Shire'],
//   'West and South Gippsland': ['Baw Baw Shire', 'Latrobe City', 'Mount Baw Baw Alpine Resort', 'South Gippsland Shire', 'Wellington Shire'],
// };



const councils = {
  NSW: councilsNSW,
  VIC: councilsVIC,
  SA: councilsSA,
};

const fallbacks = {
  SA: fallbackSA,
};

module.exports = {
  areas,
  councils,
  fallbacks,
};
