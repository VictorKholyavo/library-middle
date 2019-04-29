const express = require("express");
const app = express();
const Book = require("../schemas/library/books");
const Genre = require("../schemas/library/genre");
const { Status, Roles, User, UserDetailes, Cover, Phones, BookFiles, BookAudioFiles } = require("../../sequelize");

const roles = [
    {uuid: 1, role: "reader"},
    {uuid: 2, role: "librarian"},
    {uuid: 3, role: "admin"}
];

const genres = [
	{id: 1, name: "Sci-Fi"},
	{id: 2, name: "Horror"},
	{id: 3, name: "Detective"},
	{id: 4, name: "Adventure"},
	{id: 5, name: "Fantasy"},
	{id: 6, name: "Drama"}
];

const statuses = [
	{id: 1, status: "In Process"},
	{id: 2, status: "Accept"},
	{id: 3, status: "Declined"},
	{id: 4, status: "Return"},
];

const genrebook1 = [31, 25, 28, 30, 4, 17, 43, 40, 34, 48, 37, 36, 50, 14];

const bookGenres = [
	[31, 25, 28, 30, 4, 17, 43, 40, 34, 48, 37, 36, 50, 14],
	[18, 22, 49, 46, 48, 10, 28, 17, 26, 35, 29, 19, 8, 6, 27],
	[12, 9, 22, 17, 34, 41, 18, 35, 19, 38, 25, 16, 29, 23, 27],
	[39, 13, 28, 4, 11, 3, 7, 40, 32, 35, 49, 18, 1, 5, 24],
	[41, 44, 32, 11, 12, 31, 42, 4, 8, 43, 3, 20, 45],
	[8, 15, 43, 3, 30, 29, 2, 21, 33, 47]
];

const books = [{"title":"Big Store, The","pages":390,"year":2008,"authorName":"Ozzy","authorSurname":"Rothwell","authorPatronymic":"Audréanne","publisher":"Jones, Stracke and Mraz","country":"Portugal","availableCount":8,"genres":[5,2],"cover":"/public/uploads/covers/1.jpg"},
{"title":"Knights of Bloodsteel","pages":247,"year":2012,"authorName":"Gus","authorSurname":"Willavize","authorPatronymic":"Cléa","publisher":"Haley, Breitenberg and Dooley","country":"Latvia","availableCount":28,"genres":[5],"cover":"/public/uploads/covers/2.jpg"},
{"title":"In the Mood For Love (Fa yeung nin wa)","pages":292,"year":1985,"authorName":"Deck","authorSurname":"Hunte","authorPatronymic":"Maëlys","publisher":"Greenholt Group","country":"Philippines","availableCount":22,"genres":[1,6],"cover":"/public/uploads/covers/3.jpg"},
{"title":"Baboona","pages":317,"year":2004,"authorName":"Josepha","authorSurname":"Jochanany","authorPatronymic":"Lucrèce","publisher":"Wiegand, Lind and Mertz","country":"Zimbabwe","availableCount":6,"genres":[3],"cover":"/public/uploads/covers/4.jpg"},
{"title":"Pride of St. Louis, The","pages":358,"year":1999,"authorName":"Roseanna","authorSurname":"Hurdidge","authorPatronymic":"Loïc","publisher":"Macejkovic Inc","country":"South Korea","availableCount":17,"genres":[1],"cover":"/public/uploads/covers/5.jpg"},
{"title":"Smurfs 2, The","pages":252,"year":1994,"authorName":"Tadeas","authorSurname":"Weatherley","authorPatronymic":"Maéna","publisher":"Balistreri LLC","country":"Poland","availableCount":18,"genres":[6,3],"cover":"/public/uploads/covers/6.jpg"},
{"title":"Nowhere","pages":240,"year":2002,"authorName":"Brook","authorSurname":"Squirrell","authorPatronymic":"Véronique","publisher":"Mills and Sons","country":"France","availableCount":28,"genres":[3],"cover":"/public/uploads/covers/7.jpg"},
{"title":"Spirited Away (Sen to Chihiro no kamikakushi)","pages":425,"year":1992,"authorName":"Trista","authorSurname":"Carwithan","authorPatronymic":"Véronique","publisher":"Leannon, Rohan and Pfeffer","country":"Colombia","availableCount":5,"genres":[3],"cover":"/public/uploads/covers/8.jpg"},
{"title":"Atlas Shrugged: Who Is John Galt? (Atlas Shrugged: Part III)","pages":267,"year":1999,"authorName":"Brandie","authorSurname":"Chick","authorPatronymic":"Intéressant","publisher":"Hermiston, Rodriguez and Hane","country":"Nigeria","availableCount":29,"genres":[4],"cover":"/public/uploads/covers/9.jpg"},
{"title":"Sniper, The","pages":342,"year":2010,"authorName":"Selene","authorSurname":"Korlat","authorPatronymic":"Nuó","publisher":"Maggio Group","country":"Poland","availableCount":28,"genres":[6],"cover":"/public/uploads/covers/10.jpg"},
{"title":"Intolerable Cruelty","pages":408,"year":1990,"authorName":"Dwain","authorSurname":"Linger","authorPatronymic":"Östen","publisher":"Harvey, Ullrich and Abshire","country":"China","availableCount":27,"genres":[5],"cover":"/public/uploads/covers/11.jpg"},
{"title":"Mabel's Married Life","pages":397,"year":2010,"authorName":"Flss","authorSurname":"Dwelley","authorPatronymic":"Mélia","publisher":"Anderson-Ebert","country":"Slovenia","availableCount":5,"genres":[4],"cover":"/public/uploads/covers/12.jpg"},
{"title":"Green Lantern: Emerald Knights","pages":237,"year":1988,"authorName":"Tanya","authorSurname":"McAlpin","authorPatronymic":"Estée","publisher":"Rodriguez-Trantow","country":"Latvia","availableCount":25,"genres":[3],"cover":"/public/uploads/covers/13.jpg"},
{"title":"Fullmetal Alchemist: The Sacred Star of Milos","pages":388,"year":1987,"authorName":"Kissie","authorSurname":"Desport","authorPatronymic":"Gaïa","publisher":"Mohr Inc","country":"Indonesia","availableCount":1,"genres":[5],"cover":"/public/uploads/covers/14.jpg"},
{"title":"Lord, Save Us from Your Followers","pages":255,"year":2001,"authorName":"Rand","authorSurname":"Marder","authorPatronymic":"Céline","publisher":"Gutkowski, Cummerata and Boehm","country":"Slovenia","availableCount":24,"genres":[4],"cover":"/public/uploads/covers/15.jpg"},
{"title":"Box, The","pages":265,"year":2006,"authorName":"Lolita","authorSurname":"Lennon","authorPatronymic":"Andréanne","publisher":"Sporer-Schinner","country":"Philippines","availableCount":26,"genres":[4],"cover":"/public/uploads/covers/16.jpg"},
{"title":"Loop the Loop (Up and Down) (Horem pádem)","pages":454,"year":2004,"authorName":"Gustav","authorSurname":"Scandrite","authorPatronymic":"Nuó","publisher":"Hansen, Hessel and Predovic","country":"China","availableCount":4,"genres":[4],"cover":"/public/uploads/covers/17.jpg"},
{"title":"Wavelength","pages":383,"year":2007,"authorName":"Nicola","authorSurname":"Mulcaster","authorPatronymic":"Marie-josée","publisher":"Frami-Vandervort","country":"Philippines","availableCount":19,"genres":[3],"cover":"/public/uploads/covers/18.jpg"},
{"title":"Nocturno 29","pages":459,"year":2005,"authorName":"Milo","authorSurname":"Pachta","authorPatronymic":"Almérinda","publisher":"Corkery-Gutmann","country":"China","availableCount":2,"genres":[4],"cover":"/public/uploads/covers/19.jpg"},
{"title":"The Humanoid","pages":373,"year":2007,"authorName":"Trista","authorSurname":"Eirwin","authorPatronymic":"Illustrée","publisher":"Goodwin, Nitzsche and Smitham","country":"France","availableCount":27,"genres":[3],"cover":"/public/uploads/covers/20.jpg"},
{"title":"Wake","pages":204,"year":2008,"authorName":"Neilla","authorSurname":"D'Alessio","authorPatronymic":"Méng","publisher":"Sipes and Sons","country":"New Zealand","availableCount":4,"genres":[1],"cover":"/public/uploads/covers/21.jpg"},
{"title":"Heart of Dragon (Long de xin)","pages":446,"year":1990,"authorName":"Filberte","authorSurname":"Fullick","authorPatronymic":"Laurène","publisher":"Yundt LLC","country":"Indonesia","availableCount":6,"genres":[6],"cover":"/public/uploads/covers/22.jpg"},
{"title":"Two Brothers (Deux frères)","pages":203,"year":1993,"authorName":"Korie","authorSurname":"Kitchinghan","authorPatronymic":"Réservés","publisher":"Hintz and Sons","country":"Colombia","availableCount":26,"genres":[6],"cover":"/public/uploads/covers/23.jpg"},
{"title":"Sibling Rivalry","pages":409,"year":2008,"authorName":"Lamond","authorSurname":"Joannidi","authorPatronymic":"Stévina","publisher":"Altenwerth, Goyette and Bode","country":"China","availableCount":14,"genres":[1],"cover":"/public/uploads/covers/24.jpg"},
{"title":"Living Daylights, The","pages":418,"year":2012,"authorName":"Agnella","authorSurname":"Lenden","authorPatronymic":"Lén","publisher":"Hahn-O'Keefe","country":"Poland","availableCount":10,"genres":[1],"cover":"/public/uploads/covers/25.jpg"},
{"title":"Jungle Fighters","pages":396,"year":1998,"authorName":"Kenna","authorSurname":"Housiaux","authorPatronymic":"Miléna","publisher":"Ryan, Leuschke and Braun","country":"Philippines","availableCount":29,"genres":[4],"cover":"/public/uploads/covers/26.jpg"},
{"title":"Pink Floyd: The Wall","pages":379,"year":2003,"authorName":"Cullan","authorSurname":"Prydden","authorPatronymic":"Méng","publisher":"Sawayn, Dickinson and Kunze","country":"Portugal","availableCount":26,"genres":[6],"cover":"/public/uploads/covers/27.jpg"},
{"title":"World According to Sesame Street, The","pages":380,"year":1987,"authorName":"Colas","authorSurname":"Mara","authorPatronymic":"Maïlys","publisher":"Heller-Fritsch","country":"Bosnia and Herzegovina","availableCount":18,"genres":[2],"cover":"/public/uploads/covers/28.jpg"},
{"title":"Faith Like Potatoes","pages":387,"year":1999,"authorName":"Jozef","authorSurname":"Claxson","authorPatronymic":"Yénora","publisher":"Rutherford and Sons","country":"Slovenia","availableCount":22,"genres":[2],"cover":"/public/uploads/covers/29.jpg"},
{"title":"Time Without Pity","pages":398,"year":1994,"authorName":"Godwin","authorSurname":"Farmiloe","authorPatronymic":"Åslög","publisher":"Stiedemann Inc","country":"Kuwait","availableCount":6,"genres":[4],"cover":"/public/uploads/covers/30.jpg"},
{"title":"Casablanca","pages":244,"year":1998,"authorName":"Malanie","authorSurname":"Brabender","authorPatronymic":"Cécilia","publisher":"Eichmann LLC","country":"Latvia","availableCount":20,"genres":[1],"cover":"/public/uploads/covers/31.jpg"},
{"title":"Yellow Earth (Huang tu di)","pages":442,"year":2009,"authorName":"Bryn","authorSurname":"Iiannoni","authorPatronymic":"Océanne","publisher":"Dicki and Sons","country":"France","availableCount":20,"genres":[4],"cover":"/public/uploads/covers/32.jpg"},
{"title":"Secret of Santa Vittoria, The","pages":257,"year":1984,"authorName":"Weber","authorSurname":"Macci","authorPatronymic":"Faîtes","publisher":"Marquardt-MacGyver","country":"Ukraine","availableCount":3,"genres":[6],"cover":"/public/uploads/covers/33.jpg"},
{"title":"The Mysterious Island","pages":232,"year":1992,"authorName":"Gregory","authorSurname":"Leaman","authorPatronymic":"Bécassine","publisher":"Altenwerth-Hegmann","country":"Serbia","availableCount":3,"genres":[2],"cover":"/public/uploads/covers/34.jpg"},
{"title":"Answer This!","pages":201,"year":2002,"authorName":"Hinda","authorSurname":"Archibald","authorPatronymic":"Médiamass","publisher":"Tillman and Sons","country":"Brazil","availableCount":14,"genres":[3],"cover":"/public/uploads/covers/35.jpg"},
{"title":"Little Red Flowers (Kan shang qu hen mei)","pages":430,"year":2012,"authorName":"Codie","authorSurname":"Hanne","authorPatronymic":"Léandre","publisher":"Bahringer-Osinski","country":"United Kingdom","availableCount":7,"genres":[1],"cover":"/public/uploads/covers/36.jpg"},
{"title":"Deception","pages":207,"year":2001,"authorName":"Jon","authorSurname":"Darley","authorPatronymic":"Loïs","publisher":"Oberbrunner-Raynor","country":"Czech Republic","availableCount":5,"genres":[1],"cover":"/public/uploads/covers/37.jpg"},
{"title":"Queen of Versailles, The","pages":220,"year":1993,"authorName":"Kellsie","authorSurname":"Pirie","authorPatronymic":"Zhì","publisher":"Fay-Renner","country":"Bangladesh","availableCount":22,"genres":[4],"cover":"/public/uploads/covers/38.jpg"},
{"title":"12:08 East of Bucharest (A fost sau n-a fost?)","pages":361,"year":1993,"authorName":"Allix","authorSurname":"Coddrington","authorPatronymic":"Almérinda","publisher":"Schiller, Bauch and Hahn","country":"Portugal","availableCount":11,"genres":[5],"cover":"/public/uploads/covers/39.jpg"},
{"title":"Allan Quatermain and the Temple of Skulls","pages":364,"year":1994,"authorName":"Ernestine","authorSurname":"Siddle","authorPatronymic":"Frédérique","publisher":"Hoeger-Bergstrom","country":"Indonesia","availableCount":16,"genres":[3],"cover":"/public/uploads/covers/40.jpg"},
{"title":"Homesman, The","pages":251,"year":2009,"authorName":"Kitty","authorSurname":"Brealey","authorPatronymic":"Cinéma","publisher":"Schmitt-Muller","country":"China","availableCount":14,"genres":[3],"cover":"/public/uploads/covers/41.jpg"},
{"title":"Come to the Stable","pages":377,"year":2005,"authorName":"Lucias","authorSurname":"Burns","authorPatronymic":"Erwéi","publisher":"Lang LLC","country":"Russia","availableCount":11,"genres":[4],"cover":"/public/uploads/covers/42.jpg"},
{"title":"La montaña rusa","pages":284,"year":2004,"authorName":"Buddy","authorSurname":"Josefovic","authorPatronymic":"Annotée","publisher":"Olson, Abernathy and Keebler","country":"Brazil","availableCount":24,"genres":[3],"cover":"/public/uploads/covers/43.jpg"},
{"title":"Wavelength","pages":310,"year":2000,"authorName":"Karly","authorSurname":"Couzens","authorPatronymic":"Lóng","publisher":"Miller-Pfeffer","country":"China","availableCount":2,"genres":[2],"cover":"/public/uploads/covers/44.jpg"},
{"title":"Machine, The","pages":439,"year":2007,"authorName":"Horatius","authorSurname":"Dunguy","authorPatronymic":"Cinéma","publisher":"Zboncak-Ebert","country":"France","availableCount":23,"genres":[5],"cover":"/public/uploads/covers/45.jpg"},
{"title":"Dying Young","pages":457,"year":2009,"authorName":"Jemmy","authorSurname":"Gunter","authorPatronymic":"Esbjörn","publisher":"Senger, Bernier and Kunde","country":"Haiti","availableCount":1,"genres":[5],"cover":"/public/uploads/covers/46.jpg"},
{"title":"W.C. Fields and Me","pages":407,"year":2005,"authorName":"Flory","authorSurname":"Radnedge","authorPatronymic":"Adélie","publisher":"Quigley-Schaden","country":"Philippines","availableCount":12,"genres":[3],"cover":"/public/uploads/covers/47.jpg"},
{"title":"Tin Toy","pages":252,"year":2002,"authorName":"Catriona","authorSurname":"Stubbes","authorPatronymic":"Maéna","publisher":"Douglas Group","country":"Guatemala","availableCount":17,"genres":[2],"cover":"/public/uploads/covers/48.jpg"},
{"title":"Poultrygeist: Night of the Chicken Dead","pages":294,"year":2008,"authorName":"Willdon","authorSurname":"Antyukhin","authorPatronymic":"Loïc","publisher":"Lockman Group","country":"China","availableCount":19,"genres":[1],"cover":"/public/uploads/covers/49.jpg"},
{"title":"Sandakan 8 (Sandakan hachibanshokan bohkyo)","pages":403,"year":2005,"authorName":"Celine","authorSurname":"Haswall","authorPatronymic":"Léa","publisher":"Rau-Osinski","country":"Zambia","availableCount":22,"genres":[4],"cover":"/public/uploads/covers/50.jpg"}]

const users = [
    {id: 1, email: "user1", password: "user1", roleUuid: 1},
    {id: 2, email: "user2", password: "user2", roleUuid: 1},
    {id: 3, email: "user3", password: "user3", roleUuid: 1},
    {id: 4, email: "user4", password: "user4", roleUuid: 1},
    {id: 5, email: "user5", password: "user5", roleUuid: 1},
    {id: 6, email: "user6", password: "user6", roleUuid: 1},
    {id: 7, email: "user7", password: "user7", roleUuid: 1},
    {id: 8, email: "user8", password: "user8", roleUuid: 1},
    {id: 9, email: "user9", password: "user9", roleUuid: 1},
    {id: 10, email: "user10", password: "user10", roleUuid: 1},
    {id: 11, email: "user11", password: "user11", roleUuid: 1},
    {id: 12, email: "user12", password: "user12", roleUuid: 1},
    {id: 13, email: "user13", password: "user13", roleUuid: 1},
    {id: 14, email: "user14", password: "user14", roleUuid: 1},
    {id: 15, email: "user15", password: "user15", roleUuid: 1},
    {id: 16, email: "user16", password: "user16", roleUuid: 1},
    {id: 17, email: "user17", password: "user17", roleUuid: 1},
    {id: 18, email: "user18", password: "user18", roleUuid: 1},
    {id: 19, email: "user19", password: "user19", roleUuid: 1},
    {id: 20, email: "user20", password: "user20", roleUuid: 1},
    {id: 21, email: "user21", password: "user21", roleUuid: 1},
    {id: 22, email: "user22", password: "user22", roleUuid: 1},
    {id: 23, email: "user23", password: "user23", roleUuid: 1},
    {id: 24, email: "user24", password: "user24", roleUuid: 1},
    {id: 25, email: "user25", password: "user25", roleUuid: 1},
    {id: 26, email: "user26", password: "user26", roleUuid: 1},
    {id: 27, email: "user27", password: "user27", roleUuid: 1},
    {id: 28, email: "user28", password: "user28", roleUuid: 1},
    {id: 29, email: "user29", password: "user29", roleUuid: 1},
    {id: 30, email: "user30", password: "user30", roleUuid: 1}
];

const usersDetailes = [{"id":1,"firstname":"Gwenny","surname":"Vassbender","patronymic":"Rebeiro","passport":976423,"dateofbirth":"1981-05-28","address":"68249 Ruskin Terrace","cardnumber":327532450,"userId":1},
{"id":2,"firstname":"Anthe","surname":"Kubasiewicz","patronymic":"Van Hault","passport":869556,"dateofbirth":"1998-12-30","address":"71236 Jenna Park","cardnumber":148563438,"userId":2},
{"id":3,"firstname":"Lois","surname":"Slevin","patronymic":"Arkcoll","passport":357334,"dateofbirth":"1982-05-02","address":"1 Maple Plaza","cardnumber":343161317,"userId":3},
{"id":4,"firstname":"Trixi","surname":"Gostage","patronymic":"Bispham","passport":866032,"dateofbirth":"1963-03-30","address":"47 Shoshone Place","cardnumber":131854093,"userId":4},
{"id":5,"firstname":"Willy","surname":"Massingham","patronymic":"Frape","passport":520908,"dateofbirth":"1987-03-20","address":"65764 Thierer Court","cardnumber":131306405,"userId":5},
{"id":6,"firstname":"Abner","surname":"Lydiard","patronymic":"Vila","passport":336818,"dateofbirth":"1961-09-03","address":"4 Elgar Park","cardnumber":133075839,"userId":6},
{"id":7,"firstname":"Rodolfo","surname":"Gierth","patronymic":"Billingham","passport":681349,"dateofbirth":"1994-07-27","address":"89 International Center","cardnumber":247866724,"userId":7},
{"id":8,"firstname":"Sinclair","surname":"Normaville","patronymic":"Weine","passport":631585,"dateofbirth":"1969-04-17","address":"3 Hoffman Circle","cardnumber":145382853,"userId":8},
{"id":9,"firstname":"Garrard","surname":"Scamel","patronymic":"Doerrling","passport":304842,"dateofbirth":"1994-12-15","address":"66 Charing Cross Plaza","cardnumber":242840853,"userId":9},
{"id":10,"firstname":"Barri","surname":"Cullinane","patronymic":"Cammidge","passport":450362,"dateofbirth":"1996-12-15","address":"49 Scott Park","cardnumber":317109795,"userId":10},
{"id":11,"firstname":"Zedekiah","surname":"Angel","patronymic":"Went","passport":342455,"dateofbirth":"1973-02-01","address":"68895 Grasskamp Alley","cardnumber":246512508,"userId":11},
{"id":12,"firstname":"Frans","surname":"Guidetti","patronymic":"Toller","passport":910553,"dateofbirth":"1984-07-15","address":"4 Oak Valley Trail","cardnumber":330778295,"userId":12},
{"id":13,"firstname":"Carlynne","surname":"Attewill","patronymic":"MacTerrelly","passport":464202,"dateofbirth":"1984-05-02","address":"59 High Crossing Court","cardnumber":277090778,"userId":13},
{"id":14,"firstname":"Yul","surname":"Truce","patronymic":"Gilbert","passport":701565,"dateofbirth":"1983-07-25","address":"4 Amoth Pass","cardnumber":224496723,"userId":14},
{"id":15,"firstname":"Mirella","surname":"Dryden","patronymic":"Gammons","passport":214420,"dateofbirth":"1968-10-14","address":"7819 Burrows Street","cardnumber":318391870,"userId":15},
{"id":16,"firstname":"Casi","surname":"Dobrowolny","patronymic":"Clemmens","passport":960803,"dateofbirth":"1961-12-09","address":"8 Independence Terrace","cardnumber":343124103,"userId":16},
{"id":17,"firstname":"Annora","surname":"Shrive","patronymic":"Hearse","passport":550366,"dateofbirth":"1998-06-28","address":"230 Aberg Junction","cardnumber":187052657,"userId":17},
{"id":18,"firstname":"Jaquelyn","surname":"Fairholme","patronymic":"Grierson","passport":244719,"dateofbirth":"1976-01-17","address":"04 Sullivan Crossing","cardnumber":324869172,"userId":18},
{"id":19,"firstname":"Catharine","surname":"Pechold","patronymic":"Fruchon","passport":743374,"dateofbirth":"1960-09-04","address":"62 Schlimgen Plaza","cardnumber":148920191,"userId":19},
{"id":20,"firstname":"Bertrando","surname":"Brinkman","patronymic":"Onyon","passport":581351,"dateofbirth":"1970-01-11","address":"15 Graceland Plaza","cardnumber":215783369,"userId":20},
{"id":21,"firstname":"Benita","surname":"Schieferstein","patronymic":"Bordman","passport":504739,"dateofbirth":"1995-10-13","address":"8043 Columbus Street","cardnumber":239421673,"userId":21},
{"id":22,"firstname":"Lisha","surname":"Wyer","patronymic":"Bon","passport":890726,"dateofbirth":"1961-07-21","address":"8287 Cherokee Pass","cardnumber":239054655,"userId":22},
{"id":23,"firstname":"Gipsy","surname":"Robertz","patronymic":"Cookman","passport":415460,"dateofbirth":"1976-04-21","address":"0345 Annamark Drive","cardnumber":312834392,"userId":23},
{"id":24,"firstname":"Siusan","surname":"Dominiak","patronymic":"Iglesias","passport":599665,"dateofbirth":"1993-10-07","address":"8 Texas Alley","cardnumber":147163709,"userId":24},
{"id":25,"firstname":"Baxy","surname":"Cullotey","patronymic":"Ashling","passport":530277,"dateofbirth":"1986-10-30","address":"256 Northland Plaza","cardnumber":292274519,"userId":25},
{"id":26,"firstname":"Jemima","surname":"Hellard","patronymic":"Hulett","passport":712984,"dateofbirth":"1970-12-03","address":"725 Vera Parkway","cardnumber":149750041,"userId":26},
{"id":27,"firstname":"Sisile","surname":"Whytock","patronymic":"Broxap","passport":531785,"dateofbirth":"1988-04-13","address":"073 Hoard Place","cardnumber":179004090,"userId":27},
{"id":28,"firstname":"Wendy","surname":"Atling","patronymic":"Wellbank","passport":759567,"dateofbirth":"1972-01-11","address":"399 Superior Court","cardnumber":343885700,"userId":28},
{"id":29,"firstname":"Lynnell","surname":"Lilliman","patronymic":"Lescop","passport":922206,"dateofbirth":"1992-11-28","address":"8295 Saint Paul Crossing","cardnumber":316096604,"userId":29},
{"id":30,"firstname":"Kenn","surname":"Cardenas","patronymic":"MacMenamin","passport":720950,"dateofbirth":"1970-02-06","address":"7406 Stang Avenue","cardnumber":238508738,"userId":30}]

const phones = [{"id":1,"phone":"305-637-6527","userId":1},
{"id":2,"phone":"238-578-9280","userId":2},
{"id":3,"phone":"258-305-5935","userId":3},
{"id":4,"phone":"720-849-3576","userId":4},
{"id":5,"phone":"514-886-9546","userId":5},
{"id":6,"phone":"755-942-0078","userId":6},
{"id":7,"phone":"405-489-9916","userId":7},
{"id":8,"phone":"142-728-6825","userId":8},
{"id":9,"phone":"512-300-6415","userId":9},
{"id":10,"phone":"345-443-9667","userId":10},
{"id":11,"phone":"745-387-0093","userId":11},
{"id":12,"phone":"877-773-3915","userId":12},
{"id":13,"phone":"733-768-6999","userId":13},
{"id":14,"phone":"335-276-9559","userId":14},
{"id":15,"phone":"485-156-4050","userId":15},
{"id":16,"phone":"256-361-7631","userId":16},
{"id":17,"phone":"207-621-4776","userId":17},
{"id":18,"phone":"379-361-5599","userId":18},
{"id":19,"phone":"806-674-1781","userId":19},
{"id":20,"phone":"260-767-6055","userId":20},
{"id":21,"phone":"564-994-8107","userId":21},
{"id":22,"phone":"947-309-6069","userId":22},
{"id":23,"phone":"242-360-4307","userId":23},
{"id":24,"phone":"960-482-1785","userId":24},
{"id":25,"phone":"746-709-7577","userId":25},
{"id":26,"phone":"728-473-3610","userId":26},
{"id":27,"phone":"686-261-9805","userId":27},
{"id":28,"phone":"952-915-3724","userId":28},
{"id":29,"phone":"732-221-2671","userId":29},
{"id":30,"phone":"954-446-6236","userId":30},
{"id":31,"phone":"315-653-4517","userId":1},
{"id":32,"phone":"616-300-7907","userId":2},
{"id":33,"phone":"442-646-4586","userId":3},
{"id":34,"phone":"900-803-3118","userId":4},
{"id":35,"phone":"162-805-6845","userId":5},
{"id":36,"phone":"176-320-4203","userId":6},
{"id":37,"phone":"222-942-9433","userId":1},
{"id":38,"phone":"401-995-5700","userId":2},
{"id":39,"phone":"569-140-0568","userId":3},
{"id":40,"phone":"842-776-2210","userId":4},
{"id":41,"phone":"968-291-6539","userId":5},
{"id":42,"phone":"859-415-5567","userId":6},
{"id":43,"phone":"301-818-4911","userId":7},
{"id":44,"phone":"371-716-1110","userId":8},
{"id":45,"phone":"272-184-4260","userId":9},
{"id":46,"phone":"526-667-9921","userId":10},
{"id":47,"phone":"448-618-1306","userId":11},
{"id":48,"phone":"188-747-1809","userId":12},
{"id":49,"phone":"494-201-6491","userId":13},
{"id":50,"phone":"984-493-8365","userId":14},
{"id":51,"phone":"980-447-0747","userId":15}]

app.get("/", async (req, res) => {
    try {
        // let createdStatuses = statuses.map((status) => {
        //     return Status.create(status)
        // });
				//
        // let createdRoles = roles.map((role) => {
        //     return Roles.create(role)
        // });
				//
        // Promise.all(createdRoles).then((completed) => {
        //     let createdUsers = users.map((user, index) => {
        //         return User.create(user).then((user) => {
        //             return UserDetailes.create(usersDetailes[index]);
        //         });
        //     });
        //     Promise.all(createdUsers).then(() => {
        //         phones.map((phone) => {
        //             // phone.phone = phone.phone.replace(/-/g, "");
        //             return Phones.create({phone: phone.phone, userId: phone.userId});
        //         })
        //     });
        //     return
        // });

				let createdGenres = genres.map(async (genre) => {
          let newGenre = await new Genre ({
						name: genre.name
					});
					return newGenre.save();
        });

				let createdBooks = books.map(async (book, index) => {
					let newBook = await new Book ({
						title: book.title,
						pages: book.pages,
						year: book.year,
						authorName: book.authorName,
						authorSurname: book.authorSurname,
						authorPatronymic: book.authorPatronymic,
						publisher: book.publisher,
						country: book.country,
						availableCount: book.availableCount,
						cover: book.cover
					});
					return newBook.save(function (err, book) {
						Genre.count().exec(function (err, count) {
					  // Get a random entry
					  let random = Math.floor(Math.random() * count)
					  // Again query all users but only fetch one offset by our random #
					  Genre.findOne().skip(random).exec(
					    function (err, genre) {
								book.genres.push(genre._id);
								book.save();
					    });
						});
					});
				});

        // let createdBooks = books.map((book) => {
        //     return Books.create(book).then((createdBook) => {
        //         let path = "/public/uploads/covers/" + createdBook.dataValues.id + ".jpg";
        //         createdBook.createCover({path: path, fileType: "image/jpeg", bookId: createdBook.dataValues.id});
        //         return createdBook;
        //     })
        // });
        Promise.all(createdGenres, createdBooks).then((completed) => {
						// for (let i = 1; i < 21; i++) {
						// 	Books.findOne({where: {id: i} }).then((book) => {
						// 		let path = "/public/uploads/texts/" + i + ".txt";
						// 		book.createBookFile(({fileType: "text/plain", path: path, size: "3112", bookId: i}));
						// 	});
						// }
						// for (let i = 50; i > 37; i--) {
						// 	Books.findOne({where: {id: i} }).then((book) => {
						// 		let path = "/public/uploads/audio/" + i + ".mp3";
						// 		book.createBookAudio(({fileType: "audio/mp3", path: path, size: "311231", bookId: i}));
						// 	});
						// }
        });


		return res.send("OK!")
    } catch (error) {

    }

});

module.exports = app;
