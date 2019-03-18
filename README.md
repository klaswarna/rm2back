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
Jag gör enhetstester på de funktioner som kan destas separat. De flesta funktioner i programmet behöver emellertid
kommunicera med en databas för att fungera och samspelar med varandra. Där utför jag snarare funktionstester
genom att lägga till nya användare och påverka deras data i databasen. Rent tekniskt använder jag mocha i båda fallen
samt en testdatabas där jag lägger in användare med slumpmässiga namn.

Jag uppnår drygt 70% kodtäckning. Den kod som inte testas är kod som skulle kasta alla möjliga felmeddelanden om
databassökningarna inte hade lyckats. Ointressant att testa och skulle riskera andra bekymmer när testfallen körs.

Det framgick inga krav på inegrationstester. Därför har jag inte heller brytt mig om att testa routsen som annars
svårligen låter sig testas med enbart enhetstester.

Automatiserade tester utförs av travis, circleCI och Scrutinizer.

Lokalt kan du se kodtäckningen på rm2back/coverage/index.html i webbläsaren (i den folder du klonat repot)

Jag är nöjd med kodtäckningen eftersom alla "fungerande" fallen i business-logiken testas. Förtjänsten att testa routerna automatiskt
är inte så stor i vilket fall.

### JWT Web tokens
Jag beskriver i korthet hur JSON Web Tokens fungerar och nyttan med att använda detta. https://me-sida.kwramverk.me/#/report/jwt
