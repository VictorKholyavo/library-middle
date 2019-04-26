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
	{id: 1, genre: "Sci-Fi"},
	{id: 2, genre: "Horror"},
	{id: 3, genre: "Detective"},
	{id: 4, genre: "Adventure"},
	{id: 5, genre: "Fantasy"},
	{id: 6, genre: "Drama"}
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

const books = [{"id":1,"title":"Tinker Tailor Soldier Spy","pages":411,"year":1986,"authorName":"Rayner","authorSurname":"Dubery","authorPatronymic":"Houlaghan","publisher":"Bluezoom","country":"Tunisia","availableCount":42},
{"id":2,"title":"Places in the Heart","pages":396,"year":1996,"authorName":"Roberto","authorSurname":"Yukhnov","authorPatronymic":"Lorenc","publisher":"Yombu","country":"Slovenia","availableCount":6},
{"id":3,"title":"Genevieve","pages":170,"year":1997,"authorName":"Lothaire","authorSurname":"Caldera","authorPatronymic":"McClary","publisher":"Voolith","country":"Nicaragua","availableCount":86},
{"id":4,"title":"Jimmy Carter Man from Plains","pages":472,"year":2004,"authorName":"Skylar","authorSurname":"Goodbanne","authorPatronymic":"Mouncher","publisher":"Wordtune","country":"Indonesia","availableCount":65},
{"id":5,"title":"Winnetou: The Last Shot","pages":465,"year":1967,"authorName":"Aguistin","authorSurname":"Champagne","authorPatronymic":"Glyn","publisher":"Feedspan","country":"China","availableCount":8},
{"id":6,"title":"Paris, France","pages":156,"year":2012,"authorName":"Early","authorSurname":"Kenward","authorPatronymic":"Goulbourne","publisher":"Voolia","country":"China","availableCount":68},
{"id":7,"title":"Mo' Money","pages":169,"year":2009,"authorName":"Bartholomeus","authorSurname":"Jeannot","authorPatronymic":"Novelli","publisher":"Zoozzy","country":"Ukraine","availableCount":7},
{"id":8,"title":"Corporation, The","pages":252,"year":2008,"authorName":"Vale","authorSurname":"Gyenes","authorPatronymic":"Pardie","publisher":"Fatz","country":"China","availableCount":69},
{"id":9,"title":"Wake","pages":332,"year":2011,"authorName":"Lowell","authorSurname":"Bendan","authorPatronymic":"Suddock","publisher":"Quatz","country":"China","availableCount":85},
{"id":10,"title":"Portraits of Women (Naisenkuvia)","pages":347,"year":1997,"authorName":"Isacco","authorSurname":"Kemmis","authorPatronymic":"Minchi","publisher":"Twinte","country":"Indonesia","availableCount":17},
{"id":11,"title":"Iron & Silk","pages":474,"year":2006,"authorName":"Marius","authorSurname":"Thorouggood","authorPatronymic":"Gornar","publisher":"Thoughtbeat","country":"Thailand","availableCount":14},
{"id":12,"title":"Shadowboxer","pages":449,"year":2009,"authorName":"Corny","authorSurname":"Crosdill","authorPatronymic":"Burfoot","publisher":"Omba","country":"China","availableCount":6},
{"id":13,"title":"Messiah of Evil","pages":481,"year":2007,"authorName":"Neall","authorSurname":"Stollmeier","authorPatronymic":"Thow","publisher":"Bubblebox","country":"Indonesia","availableCount":35},
{"id":14,"title":"Ghost Adventures","pages":217,"year":2001,"authorName":"Neall","authorSurname":"Stollmeier","authorPatronymic":"Thow","publisher":"Jetwire","country":"Spain","availableCount":28},
{"id":15,"title":"Fantastic Four: Rise of the Silver Surfer","pages":233,"year":1987,"authorName":"Payton","authorSurname":"Tombleson","authorPatronymic":"Maytom","publisher":"Trilith","country":"Iran","availableCount":35},
{"id":16,"title":"Lonesome Dove","pages":214,"year":2007,"authorName":"Joe","authorSurname":"Romei","authorPatronymic":"Byatt","publisher":"Yamia","country":"Indonesia","availableCount":10},
{"id":17,"title":"Deluge, The (Potop)","pages":299,"year":2007,"authorName":"Everard","authorSurname":"Cowely","authorPatronymic":"Melbert","publisher":"Photolist","country":"Indonesia","availableCount":65},
{"id":18,"title":"Dead Meat","pages":238,"year":2006,"authorName":"Neall","authorSurname":"Stollmeier","authorPatronymic":"Thow","publisher":"Twitternation","country":"China","availableCount":50},
{"id":19,"title":"Welcome to Collinwood","pages":468,"year":2003,"authorName":"Auberon","authorSurname":"Clother","authorPatronymic":"Songest","publisher":"Roomm","country":"Russia","availableCount":74},
{"id":20,"title":"Way Back, The","pages":356,"year":2004,"authorName":"Hewe","authorSurname":"Smallcomb","authorPatronymic":"MacKaig","publisher":"Skinder","country":"Indonesia","availableCount":6},
{"id":21,"title":"Magnificent Obsession","pages":458,"year":1987,"authorName":"Nikita","authorSurname":"O'Kieran","authorPatronymic":"Alderman","publisher":"Pixope","country":"Spain","availableCount":77},
{"id":22,"title":"Pee-wee's Big Adventure","pages":499,"year":1998,"authorName":"Teador","authorSurname":"Butterfint","authorPatronymic":"Causley","publisher":"Pixonyx","country":"Slovenia","availableCount":72},
{"id":23,"title":"Kids for Cash","pages":252,"year":1993,"authorName":"Dwight","authorSurname":"Chetham","authorPatronymic":"Tubbs","publisher":"Twitternation","country":"Burkina Faso","availableCount":51},
{"id":24,"title":"7 Seconds","pages":408,"year":2009,"authorName":"Rex","authorSurname":"Gowdie","authorPatronymic":"Grollmann","publisher":"Fanoodle","country":"Nigeria","availableCount":80},
{"id":25,"title":"Michael","pages":276,"year":2009,"authorName":"Del","authorSurname":"Condon","authorPatronymic":"Betke","publisher":"Livetube","country":"China","availableCount":65},
{"id":26,"title":"Rånarna","pages":301,"year":1996,"authorName":"Hartwell","authorSurname":"Boshere","authorPatronymic":"Latter","publisher":"Blognation","country":"Ethiopia","availableCount":4},
{"id":27,"title":"Trigun: Badlands Rumble","pages":317,"year":2008,"authorName":"Hebert","authorSurname":"Snell","authorPatronymic":"Peterken","publisher":"Photospace","country":"Czech Republic","availableCount":29},
{"id":28,"title":"Fog, The","pages":158,"year":1999,"authorName":"Tymon","authorSurname":"Dust","authorPatronymic":"Vaughten","publisher":"Buzzdog","country":"Dominican Republic","availableCount":28},
{"id":29,"title":"Man in the Gray Flannel Suit, The","pages":461,"year":1995,"authorName":"Neel","authorSurname":"Rippen","authorPatronymic":"Burd","publisher":"Cogibox","country":"Panama","availableCount":56},
{"id":30,"title":"Bible, The (a.k.a. Bible... In the Beginning, The)","pages":387,"year":1988,"authorName":"Ringo","authorSurname":"Meckiff","authorPatronymic":"Burkin","publisher":"Wikido","country":"Sweden","availableCount":39},
{"id":31,"title":"Café Metropole","pages":404,"year":1997,"authorName":"Marijn","authorSurname":"Peto","authorPatronymic":"Larkins","publisher":"Youfeed","country":"Pakistan","availableCount":3},
{"id":32,"title":"Anacondas: The Hunt for the Blood Orchid","pages":408,"year":2006,"authorName":"Randie","authorSurname":"Demkowicz","authorPatronymic":"Vaughan-Hughes","publisher":"Roombo","country":"China","availableCount":86},
{"id":33,"title":"Prinsessa (Starring Maja)","pages":349,"year":2011,"authorName":"Tuckie","authorSurname":"English","authorPatronymic":"Soda","publisher":"Babbleset","country":"Chile","availableCount":71},
{"id":34,"title":"Filth and the Fury, The","pages":195,"year":2008,"authorName":"Jared","authorSurname":"Yurkov","authorPatronymic":"Kidstone","publisher":"Plambee","country":"China","availableCount":49},
{"id":35,"title":"Maiden Heist, The","pages":401,"year":2010,"authorName":"Corny","authorSurname":"Morales","authorPatronymic":"Arnoldi","publisher":"Gigaclub","country":"Argentina","availableCount":88},
{"id":36,"title":"Sweetgrass","pages":175,"year":2010,"authorName":"Toiboid","authorSurname":"McMurray","authorPatronymic":"Gosling","publisher":"Tanoodle","country":"Indonesia","availableCount":96},
{"id":37,"title":"Pact, The","pages":293,"year":2008,"authorName":"Marijn","authorSurname":"Wheelband","authorPatronymic":"Kelcher","publisher":"Jaloo","country":"Philippines","availableCount":23},
{"id":38,"title":"Titan A.E.","pages":341,"year":1995,"authorName":"Herb","authorSurname":"Mabbot","authorPatronymic":"Renbold","publisher":"Rhybox","country":"Ireland","availableCount":65},
{"id":39,"title":"Homevideo","pages":170,"year":2011,"authorName":"Randell","authorSurname":"Hotchkin","authorPatronymic":"Cannicott","publisher":"Zava","country":"Philippines","availableCount":38},
{"id":40,"title":"Burning Blue","pages":417,"year":2000,"authorName":"Fonsie","authorSurname":"Drover","authorPatronymic":"Molesworth","publisher":"Youspan","country":"Argentina","availableCount":57},
{"id":41,"title":"Man of the Year","pages":165,"year":1999,"authorName":"Tadio","authorSurname":"Wakeley","authorPatronymic":"Gisburn","publisher":"Quatz","country":"Philippines","availableCount":43},
{"id":42,"title":"Three Way","pages":279,"year":1993,"authorName":"Shellysheldon","authorSurname":"Mills","authorPatronymic":"Grunwald","publisher":"Meetz","country":"Philippines","availableCount":36},
{"id":43,"title":"Magic Gloves, The (Los guantes mágicos)","pages":256,"year":2008,"authorName":"Pyotr","authorSurname":"Yeldon","authorPatronymic":"Pashby","publisher":"Lazz","country":"Poland","availableCount":90},
{"id":44,"title":"Savages","pages":394,"year":1995,"authorName":"Frankie","authorSurname":"Speaks","authorPatronymic":"Meeland","publisher":"Aimbu","country":"Iran","availableCount":88},
{"id":45,"title":"Sergeant Körmy and the South Pacific (Vääpeli Körmy ja etelän hetelmät)","pages":165,"year":2006,"authorName":"Buck","authorSurname":"Peasegod","authorPatronymic":"Nisard","publisher":"Digitube","country":"China","availableCount":18},
{"id":46,"title":"My Dinner with André","pages":407,"year":1991,"authorName":"Harris","authorSurname":"Andrieux","authorPatronymic":"Klimentov","publisher":"Kwinu","country":"France","availableCount":7},
{"id":47,"title":"Clerks","pages":158,"year":1999,"authorName":"Maynard","authorSurname":"Dudderidge","authorPatronymic":"Hukins","publisher":"Skiptube","country":"Poland","availableCount":42},
{"id":48,"title":"Green Butchers, The (Grønne slagtere, De)","pages":242,"year":2006,"authorName":"George","authorSurname":"Woollaston","authorPatronymic":"Lipscomb","publisher":"Yombu","country":"Indonesia","availableCount":62},
{"id":49,"title":"Dog's Life, A","pages":193,"year":2000,"authorName":"Ambrosius","authorSurname":"Fisk","authorPatronymic":"Slopier","publisher":"Mycat","country":"China","availableCount":89},
{"id":50,"title":"Fragments of an Alms-Film (Fragmentos de um Filme-Esmola: A Sagrada Família)","pages":403,"year":1985,"authorName":"Malvin","authorSurname":"Bicker","authorPatronymic":"Pacher","publisher":"Linktype","country":"China","availableCount":88}]

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
        let createdStatuses = statuses.map((status) => {
            return Status.create(status)
        });

        let createdRoles = roles.map((role) => {
            return Roles.create(role)
        });

        Promise.all(createdRoles).then((completed) => {
            let createdUsers = users.map((user, index) => {
                return User.create(user).then((user) => {
                    return UserDetailes.create(usersDetailes[index]);
                });
            });
            Promise.all(createdUsers).then(() => {
                phones.map((phone) => {
                    // phone.phone = phone.phone.replace(/-/g, "");
                    return Phones.create({phone: phone.phone, userId: phone.userId});
                })
            });
            return
        });

				let createdGenres = genres.map((genre) => {
            return Genres.create(genre);
        })
				let createdBooks = books.map((book, index) => {
					let path = "/public/uploads/covers/" + index+1 + ".jpg";
					let newBook = await new Book ({
						title: req.body.title,
						pages: req.body.pages,
						year: req.body.year,
						authorName: req.body.authorName,
						authorSurname: req.body.authorSurname,
						authorPatronymic: req.body.authorPatronymic,
						publisher: req.body.publisher,
						country: req.body.country,
						availableCount: req.body.availableCount,
						cover: path
					});
					return newBook.save();
				})
        // let createdBooks = books.map((book) => {
        //     return Books.create(book).then((createdBook) => {
        //         let path = "/public/uploads/covers/" + createdBook.dataValues.id + ".jpg";
        //         createdBook.createCover({path: path, fileType: "image/jpeg", bookId: createdBook.dataValues.id});
        //         return createdBook;
        //     })
        // });
        Promise.all(createdGenres, createdBooks, genres).then((completed) => {
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
