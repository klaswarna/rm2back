# rm2back


[![Build Status](https://travis-ci.org/klaswarna/rm2back.svg?branch=master)](https://travis-ci.org/klaswarna/rm2back)
[![CircleCI](https://circleci.com/gh/klaswarna/rm2back.svg?style=svg)](https://circleci.com/gh/klaswarna/rm2back)
[![Scrutinizer Code Quality](https://scrutinizer-ci.com/g/klaswarna/rm2back/badges/quality-score.png?b=master)](https://scrutinizer-ci.com/g/klaswarna/rm2back/?branch=master)
[![Code Coverage](https://scrutinizer-ci.com/g/klaswarna/rm2back/badges/coverage.png?b=master)](https://scrutinizer-ci.com/g/klaswarna/rm2back/?branch=master)


### Backend
Express i node.js känns som ett stabilt och moget backendverktyg, både i sig självt och för mig, eftersom jag har använt det flera gånger förr. Att det är javascript som gäller för att skapa dynamik i webbläsaren medför att man ändå måste behärska det språket. Två flugor i en smäll alltså.

Som databas använde jag sqlite. Valet föll på det, dels därför att jag precis använt det i ett annat projekt och känner mig uppdaterad, och dels för att jag ville ha minimal interferens med andra routrar på samma server som också behöver databaser. Jag tänkte att var databas i sin fil minskar den risken. För att hela projektet inte skulle vara för tungrott använde jag korta asynkrona requester direkt från node.

För att återställa aktiekurserna kan man skriva https://rm2back.kwramverk.me/reset/.

För att stanna och återta ständig uppdatering i kurssimuleringen används https://rm2back.kwramverk.me/reset/stop respektive https://rm2back.kwramverk.me/reset/start

### Realtid
För att frontendsidan ständigt skall kunna uppdatera aktiekurserna sänds de ut var 10:e sekund via vue-native-websocket. Så fort en användare har loggat in på aktiekurssidan kopplas hen upp mot denna service. Av praktiska skäl använde jag samma node-app som hanterar routsen att även simulera en aktiekurs och skicka ut dessa med Websocket.

### Enhets- och funktionstester
Jag gör enhetstester på de funktioner som kan testas separat. De flesta funktioner i programmet behöver emellertid
kommunicera med en databas för att fungera och samspelar med varandra. Där utför jag snarare funktionstester
genom att lägga till nya användare och påverka deras data i databasen. Rent tekniskt använder jag mocha i båda fallen
samt en testdatabas där jag lägger in användare med slumpmässiga namn.

Jag uppnår drygt 70% kodtäckning i mina testfall när jag testas lokalt. Den kod som inte testas är kod som skulle kasta alla möjliga felmeddelanden om
databassökningarna inte hade lyckats. Knepigare att testa och skulle riskera andra bekymmer när testfallen körs.

Lokalt kan man se kodtäckningen på rm2back/coverage/index.html i webbläsaren (i den folder du klonat repot).

Det framgick inga krav på integrationstester. Därför har jag inte heller brytt mig om att testa routsen som annars
svårligen låter sig testas med enbart enhetstester. Detta gör att Scrutinizer endast tycker att 34% av koden är testad.

Automatiserade tester utförs av travis, circleCI och Scrutinizer. Den sistnämnda strulade mäkta denna gång, tills jag fick rätt version
på node via konfigurationsfilen. Så totalt sett hade jag hunnit testa allt för hand tio gånger om på samma tid som det tog att få ordning på CI-kedjan, men
till nästa gång har jag mera koll. Men förtjänsten blir nog större ju fler komplexa klasser och funktioner man har i förhållande till enkla router och databassök.

Jag är någorlunda nöjd med kodtäckningen eftersom alla "fungerande" fallen i business-logiken testas. Att själva routerna inte testats separat
spelar mindre roll då funktionerna de använder tycks fungera.

### JWT Web tokens
Jag beskriver i korthet hur JSON Web Tokens fungerar och nyttan med att använda detta. https://me-sida.kwramverk.me/#/report/jwt
