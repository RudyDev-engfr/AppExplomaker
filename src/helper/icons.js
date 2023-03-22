import { EVENT_TYPES } from './constants'

import mainRestaurant from '../images/eventCreator/restaurant/main.svg'
import burger from '../images/eventCreator/restaurant/burger.svg'
import coffee from '../images/eventCreator/restaurant/coffee.svg'
import pizza from '../images/eventCreator/restaurant/pizza.svg'
import beer from '../images/eventCreator/restaurant/beer.svg'
import muffin from '../images/eventCreator/restaurant/muffin.svg'
import bread from '../images/eventCreator/restaurant/bread.svg'
import cocktail from '../images/eventCreator/restaurant/cocktail.svg'
import icecream from '../images/eventCreator/restaurant/icecream.svg'
import meat from '../images/eventCreator/restaurant/meat.svg'
import tea from '../images/eventCreator/restaurant/tea.svg'
import veggie from '../images/eventCreator/restaurant/veggie.svg'
import mainTransports from '../images/eventCreator/transport/main.svg'
import train from '../images/eventCreator/transport/train.svg'
import taxi from '../images/eventCreator/transport/taxi.svg'
import bike from '../images/eventCreator/transport/bike.svg'
import walk from '../images/eventCreator/transport/walk.svg'
import car from '../images/eventCreator/transport/car.svg'
import subway from '../images/eventCreator/transport/subway.svg'
import tramway from '../images/eventCreator/transport/tramway.svg'
import ferry from '../images/eventCreator/transport/ferry.svg'
import boat from '../images/eventCreator/transport/boat.svg'
import mainAccommodation from '../images/eventCreator/accommodation/main.svg'
import bed from '../images/eventCreator/accommodation/bed.svg'
import tipi from '../images/eventCreator/accommodation/tipi.svg'
import building from '../images/eventCreator/accommodation/building.svg'
import house from '../images/eventCreator/accommodation/house.svg'
import bus from '../images/eventCreator/accommodation/bus.svg'
import mainFlight from '../images/eventCreator/flight/main.svg'
import takeOff from '../images/eventCreator/flight/takeOff.svg'
import landing from '../images/eventCreator/flight/landing.svg'
import transit from '../images/eventCreator/flight/transit.svg'
import mainExploration from '../images/eventCreator/explore/main.svg'
import fishing from '../images/eventCreator/explore/fishing.svg'
import bicycle from '../images/eventCreator/explore/bicycle.svg'
import anchor from '../images/eventCreator/explore/anchor.svg'
import mountainBike from '../images/eventCreator/explore/mountainBike.svg'
import hiking from '../images/eventCreator/explore/hiking.svg'
import handball from '../images/eventCreator/explore/handball.svg'
import basketball from '../images/eventCreator/explore/basketball.svg'
import snowmobile from '../images/eventCreator/explore/snowmobile.svg'
import beach from '../images/eventCreator/explore/beach.svg'
import kayaking from '../images/eventCreator/explore/kayaking.svg'
import diving from '../images/eventCreator/explore/diving.svg'

export const explore = [
  {
    icon: mainExploration,
    value: 'main',
  },
  {
    icon: fishing,
    value: 'fishing',
  },
  {
    icon: bicycle,
    value: 'bicycle',
  },
  {
    icon: anchor,
    value: 'anchor',
  },
  {
    icon: mountainBike,
    value: 'mountainBike',
  },
  {
    icon: hiking,
    value: 'hiking',
  },
  {
    icon: handball,
    value: 'handball',
  },
  {
    icon: basketball,
    value: 'basketball',
  },
  {
    icon: snowmobile,
    value: 'snowmobile',
  },
  {
    icon: beach,
    value: 'beach',
  },
  {
    icon: kayaking,
    value: 'kayaking',
  },
  {
    icon: diving,
    value: 'diving',
  },
]

export const flight = [
  {
    icon: mainFlight,
    value: 'main',
  },
  {
    icon: takeOff,
    value: 'takeOff',
  },
  {
    icon: landing,
    value: 'landing',
  },
  {
    icon: transit,
    value: 'transit',
  },
]

export const accomodation = [
  {
    icon: mainAccommodation,
    value: 'main',
  },
  {
    icon: bed,
    value: 'bed',
  },
  {
    icon: tipi,
    value: 'tipi',
  },
  {
    icon: building,
    value: 'flat',
  },
  {
    icon: house,
    value: 'guest-house',
  },
  {
    icon: bus,
    value: 'van',
  },
]

export const transport = [
  {
    icon: mainTransports,
    value: 'main',
  },
  {
    icon: train,
    value: 'train',
  },
  {
    icon: taxi,
    value: 'taxi',
  },
  {
    icon: bike,
    value: 'bike',
  },
  {
    icon: walk,
    value: 'walk',
  },
  {
    icon: car,
    value: 'car',
  },
  {
    icon: subway,
    value: 'subway',
  },
  {
    icon: tramway,
    value: 'tramway',
  },
  {
    icon: ferry,
    value: 'ferry',
  },
  {
    icon: boat,
    value: 'sail-boat',
  },
]

export const restaurant = [
  {
    icon: mainRestaurant,
    value: 'main',
  },
  {
    icon: burger,
    value: 'hamburger',
  },
  {
    icon: coffee,
    value: 'coffee',
  },
  {
    icon: pizza,
    value: 'pizza',
  },
  {
    icon: beer,
    value: 'beer',
  },
  {
    icon: muffin,
    value: 'muffin',
  },
  {
    icon: bread,
    value: 'baguette',
  },
  {
    icon: cocktail,
    value: 'glass-cocktail',
  },
  {
    icon: icecream,
    value: 'ice-cream',
  },
  {
    icon: meat,
    value: 'food-drumstick',
  },
  {
    icon: tea,
    value: 'tea',
  },
  {
    icon: veggie,
    value: 'carrot',
  },
]

/**
 * Return icon from Firebase Storage
 * @param {string} iconName
 * @param {bool} isActive
 */
export function findGoogleMarker(iconName, isActive) {
  let iconSrc =
    'https://firebasestorage.googleapis.com/v0/b/explomaker-3010b.appspot.com/o/googleMapsIcons%2F'
  switch (iconName) {
    case 'accommodation':
      iconSrc += isActive
        ? 'accomodationActive.svg?alt=media&token=43d67cbc-c8aa-42d9-b723-cbba07e6d68c'
        : 'accomodationInactive.svg?alt=media&token=2bae343d-2fc4-484e-a18a-2daf0b0e06a9'
      break
    case 'flight':
      iconSrc += isActive
        ? 'flightActive.svg?alt=media&token=170b4e7a-c480-43ce-b021-68b5a04001b1'
        : 'flightInactive.svg?alt=media&token=7ea670d3-a2c4-49e1-a7c6-69c14364e170'
      break
    case 'explore':
      iconSrc += isActive
        ? 'exploActive.svg?alt=media&token=7d18fafa-89a4-4e43-8d5e-9bd75bb4b9d1'
        : 'exploInactive.svg?alt=media&token=d58dc429-ff6a-415b-8374-bffe8d54fe3c'
      break
    case 'transport':
      iconSrc += isActive
        ? 'transportActive.svg?alt=media&token=f9248adf-29d6-40f5-b8c1-42e6e9c4408d'
        : 'transportInactive.svg?alt=media&token=0b38c303-8694-4d2a-b536-e43e6415418a'
      break
    case 'restaurant':
      iconSrc += isActive
        ? 'restaurantActive.svg?alt=media&token=f4ec38eb-7946-464e-858d-ac1379fc854a'
        : 'restaurantInactive.svg?alt=media&token=6b9a148a-3f8f-47d3-851f-bd17532c3f08'
      break
    default:
      break
  }
  return iconSrc
}

export function findSpecificGoogleMarker(iconName, isActive, eventType) {
  let iconSrc =
    'https://firebasestorage.googleapis.com/v0/b/explomaker-3010b.appspot.com/o/googleMapsIcons%2F'
  switch (iconName) {
    case 'main':
      if (eventType === EVENT_TYPES[0]) {
        iconSrc += isActive
          ? 'accomodationActive.svg?alt=media&token=43d67cbc-c8aa-42d9-b723-cbba07e6d68c'
          : 'accomodationInactive.svg?alt=media&token=2bae343d-2fc4-484e-a18a-2daf0b0e06a9'
      } else if (eventType === EVENT_TYPES[1]) {
        iconSrc += isActive
          ? 'flightActive.svg?alt=media&token=170b4e7a-c480-43ce-b021-68b5a04001b1'
          : 'flightInactive.svg?alt=media&token=7ea670d3-a2c4-49e1-a7c6-69c14364e170'
      } else if (eventType === EVENT_TYPES[2]) {
        iconSrc += isActive
          ? 'exploActive.svg?alt=media&token=7d18fafa-89a4-4e43-8d5e-9bd75bb4b9d1'
          : 'exploInactive.svg?alt=media&token=d58dc429-ff6a-415b-8374-bffe8d54fe3c'
      } else if (eventType === EVENT_TYPES[3]) {
        iconSrc += isActive
          ? 'transportActive.svg?alt=media&token=f9248adf-29d6-40f5-b8c1-42e6e9c4408d'
          : 'transportInactive.svg?alt=media&token=0b38c303-8694-4d2a-b536-e43e6415418a'
      } else if (eventType === EVENT_TYPES[4]) {
        iconSrc += isActive
          ? 'restaurantActive.svg?alt=media&token=f4ec38eb-7946-464e-858d-ac1379fc854a'
          : 'restaurantInactive.svg?alt=media&token=6b9a148a-3f8f-47d3-851f-bd17532c3f08'
      }
      break
    case 'accommodation':
      iconSrc += isActive
        ? 'accomodationActive.svg?alt=media&token=43d67cbc-c8aa-42d9-b723-cbba07e6d68c'
        : 'accomodationInactive.svg?alt=media&token=2bae343d-2fc4-484e-a18a-2daf0b0e06a9'
      break
    case 'flat':
      iconSrc += isActive
        ? 'flatActive.svg?alt=media&token=94f4f165-08bc-4a0a-82dd-d87d4379a3de'
        : 'flatInactive.svg?alt=media&token=4a04d860-ab97-41fc-82ac-02f2d449733f'
      break
    case 'guest-house':
      iconSrc += isActive
        ? 'guest-houseActive.svg?alt=media&token=5c39757e-a542-4f78-a0bf-4f1ee00a5eb1'
        : 'guest-houseInactive.svg?alt=media&token=adb64a8c-96bf-4b1d-b00d-7b4b396b462b'
      break
    case 'bed':
      iconSrc += isActive
        ? 'hotelActive.svg?alt=media&token=d0472025-3b1b-4b70-a0cc-3cae0143a5bb'
        : 'hotelInactive.svg?alt=media&token=e89bde15-8d8f-43f1-bc0c-650d68ec6df4'
      break
    // case 'house':
    //   iconSrc += isActive
    //     ? 'houseActive.svg?alt=media&token=669f3c9b-360e-4d36-b655-2f15a7341d97'
    //     : 'houseInactive.svg?alt=media&token=c87ffa07-5064-4684-86b4-180b64ffd103'
    //   break
    case 'tipi':
      iconSrc += isActive
        ? 'tentActive.svg?alt=media&token=216ca185-2632-487c-8416-eb5271ccc9ec'
        : 'tentInactive.svg?alt=media&token=1c223aa5-620e-4b22-9e70-0254df21e656'
      break
    case 'van':
      iconSrc += isActive
        ? 'vanActive.svg?alt=media&token=132a51b0-4f12-418c-92e2-12cebbf251b5'
        : 'vanInactive.svg?alt=media&token=3b719a2d-6fef-4541-a0a1-82147c0b7dc6'
      break
    // FlightIcons
    case 'flight':
      iconSrc += isActive
        ? 'flightActive.svg?alt=media&token=170b4e7a-c480-43ce-b021-68b5a04001b1'
        : 'flightInactive.svg?alt=media&token=7ea670d3-a2c4-49e1-a7c6-69c14364e170'
      break
    case 'landing':
      iconSrc += isActive
        ? 'landingActive.svg?alt=media&token=c4ee622a-5f08-4b95-9b60-ce76d343d587'
        : 'landingInactive.svg?alt=media&token=aa87da31-dac9-4081-b16c-ee188a6fbe14'
      break
    case 'take-off':
      iconSrc += isActive
        ? 'take-offActive.svg?alt=media&token=a4c6f145-4776-491d-beb6-ca09b35fd4f7'
        : 'take-offInactive.svg?alt=media&token=71fa1532-e945-460b-b1bb-1456f1407e33'
      break
    case 'plane':
      iconSrc += isActive
        ? 'planeActive.svg?alt=media&token=c82dc67a-2bdb-4aba-af77-6dcf44466c55'
        : 'planeInactive.svg?alt=media&token=40afd890-f5ef-47ed-9767-4a28351be6b4'
      break
    case 'flight-connection':
      iconSrc += isActive
        ? 'flight-connectionActive.svg?alt=media&token=ebe104a2-f02e-4066-911f-ac02507ffa1b'
        : 'flight-connectionInactive.svg?alt=media&token=2788245b-453d-4766-b5cc-ba64f775a6a4'
      break
    // ExplorationIcons
    case 'explore':
      iconSrc += isActive
        ? 'exploActive.svg?alt=media&token=7d18fafa-89a4-4e43-8d5e-9bd75bb4b9d1'
        : 'exploInactive.svg?alt=media&token=d58dc429-ff6a-415b-8374-bffe8d54fe3c'
      break
    case 'anchor':
      iconSrc += isActive
        ? 'anchorActive.svg?alt=media&token=530cb7b4-8273-4118-839e-1b0ba7c8fc96'
        : 'anchorInactive.svg?alt=media&token=64f94cc5-2dea-454c-b0eb-948dde031900'
      break
    case 'hiking':
      iconSrc += isActive
        ? 'hikingActive.svg?alt=media&token=ee53604f-07f0-48a6-af54-01b8c21806b2'
        : 'hikingInactive.svg?alt=media&token=c1303590-02e3-4d80-9be5-757974eaa803'
      break
    case 'basketball':
      iconSrc += isActive
        ? 'basketballActive.svg?alt=media&token=ac2b5543-c830-4bc4-93bd-513a6961052b'
        : 'basketballInactive.svg?alt=media&token=cfbc9618-223a-452b-876c-f611bbbcf5fc'
      break
    case 'beach':
      iconSrc += isActive
        ? 'beachActive.svg?alt=media&token=39ffe297-3ac5-4120-ab9a-c467d55c681a'
        : 'beachInactive.svg?alt=media&token=59571f66-6e7d-4b04-8bcc-767b6dbc2847'
      break
    case 'bike':
      iconSrc += isActive
        ? 'bikeActive.svg?alt=media&token=54c72af8-7863-471f-b86a-29d9006a8f1e'
        : 'bikeInactive.svg?alt=media&token=df8cfab8-a6e9-4a73-81c7-2e4ac02088e1'
      break
    case 'compass':
      iconSrc += isActive
        ? 'compassActive.svg?alt=media&token=781a2281-98c1-4f2a-95d2-3e30d138cb6b'
        : 'compassInactive.svg?alt=media&token=956207c1-0ef1-4c9a-9c17-24f396de81e6'
      break
    case 'fishing':
      iconSrc += isActive
        ? 'divingActive.svg?alt=media&token=d1db0c2c-809f-4ef7-8170-28e6aadee2e0'
        : 'divingInactive.svg?alt=media&token=6d7659ce-137c-4abd-9cbd-d00014160aae'
      break
    case 'diving':
      iconSrc += isActive
        ? 'diving-snorkelActive.svg?alt=media&token=b118acd5-b858-4441-a926-4d2c7d755aca'
        : 'diving-snorkelInactive.svg?alt=media&token=1ec39e57-af8e-4424-8777-98fecdce39a7'
      break
    case 'handball':
      iconSrc += isActive
        ? 'handballActive.svg?alt=media&token=d1b75593-4ef9-491a-9f2c-5d53750513b5'
        : 'handballInactive.svg?alt=media&token=e15c0d0a-3c89-4d1a-beb5-c85a25a954d6'
      break
    case 'kayaking':
      iconSrc += isActive
        ? 'kayakingActive.svg?alt=media&token=7af76f91-9581-47d2-8473-ffc69569ce19'
        : 'kayakingInactive.svg?alt=media&token=ddfa2669-2003-40f2-9224-a2788ad4053f'
      break
    case 'snowmobile':
      iconSrc += isActive
        ? 'snowmobileActive.svg?alt=media&token=db2f7295-2814-4bba-ac69-bbb89088c6dd'
        : 'snowmobileInactive.svg?alt=media&token=53afbf35-ede7-4f7d-9c42-4abc70c41c9e'
      break
    case 'bicycle':
      iconSrc += isActive
        ? 'bicycleActive.svg?alt=media&token=b04ff25a-f11b-4fa3-9fea-41521b1f3c5d'
        : 'bicycleInactive.svg?alt=media&token=4471c031-00b1-4f85-bd59-7718684da453'
      break
    // TransportIcons
    case 'transport':
      iconSrc += isActive
        ? 'transportActive.svg?alt=media&token=f9248adf-29d6-40f5-b8c1-42e6e9c4408d'
        : 'transportInactive.svg?alt=media&token=0b38c303-8694-4d2a-b536-e43e6415418a'
      break
    case 'ferry':
      iconSrc += isActive
        ? 'ferryActive.svg?alt=media&token=4bf1020a-9dc7-4c81-8d79-bda78978efb5'
        : 'ferryInactive.svg?alt=media&token=782aa722-7243-45ba-9771-22cc77752a2a'
      break
    case 'bus':
      iconSrc += isActive
        ? 'busActive.svg?alt=media&token=e30a5e7d-7102-4485-9dc5-94e458431c7e'
        : 'busInactive.svg?alt=media&token=bb5bb7a0-f776-4518-a792-894d484311df'
      break
    case 'car':
      iconSrc += isActive
        ? 'carActive.svg?alt=media&token=138c8cc7-9e20-4ca2-ad11-58bde6aa62db'
        : 'carInactive.svg?alt=media&token=fb0e7eb6-ccdc-4ac1-aac2-03f1ac836946'
      break
    case 'sail-boat':
      iconSrc += isActive
        ? 'sail-boatActive.svg?alt=media&token=caa1a268-2665-45fd-bf4f-9d357b33b7c5'
        : 'sail-boatInactive.svg?alt=media&token=8d0de039-119e-40fe-8dcf-7bfaa1782232'
      break
    case 'subway':
      iconSrc += isActive
        ? 'subwayActive.svg?alt=media&token=c5a6da9f-bb6c-45c7-be51-e52289aeeccc'
        : 'subwayInactive.svg?alt=media&token=77d2c23e-d812-4e31-88b7-d4308fbb1ad8'
      break
    case 'taxi':
      iconSrc += isActive
        ? 'taxiActive.svg?alt=media&token=fd32b2a8-459b-479f-a810-4b7dd582dd7b'
        : 'taxiInactive.svg?alt=media&token=efa27d82-c173-4bfd-beb1-2d85bed61eea'
      break
    case 'train':
      iconSrc += isActive
        ? 'trainActive.svg?alt=media&token=48832108-14a4-42cd-94da-01ef9fbccb75'
        : 'trainInactive.svg?alt=media&token=88067935-e7ee-4937-a5e0-5b47877727b7'
      break
    case 'tramway':
      iconSrc += isActive
        ? 'tramwayActive.svg?alt=media&token=eb6bc1f9-a99b-4688-a903-c36d493d1382'
        : 'tramwayInactive.svg?alt=media&token=5c2983eb-03a7-4ff0-83a5-7d794c3553ae'
      break
    case 'walk':
      iconSrc += isActive
        ? 'walkInactive.svg?alt=media&token=382b1251-05d2-459f-b7cc-eb99f7c22cd1'
        : 'walkInactive.svg?alt=media&token=382b1251-05d2-459f-b7cc-eb99f7c22cd1'
      break
    // RestaurantIcons
    case 'restaurant':
      iconSrc += isActive
        ? 'restaurantActive.svg?alt=media&token=f4ec38eb-7946-464e-858d-ac1379fc854a'
        : 'restaurantInactive.svg?alt=media&token=6b9a148a-3f8f-47d3-851f-bd17532c3f08'
      break
    case 'baguette':
      iconSrc += isActive
        ? 'baguetteActive.svg?alt=media&token=97c72100-0fc5-4615-8497-5a1b0526a269'
        : 'baguetteInactive.svg?alt=media&token=e2ad4abe-3aa0-4f9a-828d-5d633181b764'
      break
    case 'carrot':
      iconSrc += isActive
        ? 'carrotActive.svg?alt=media&token=e6b985c8-4602-4368-8034-32ba620fb5b8'
        : 'carrotInactive.svg?alt=media&token=5caaa52c-f7d3-405a-8987-ae8efebba12d'
      break
    case 'coffee':
      iconSrc += isActive
        ? 'coffeeActive.svg?alt=media&token=20ccda44-1cdb-49d1-ae87-bf82881accf2'
        : 'coffeeInactive.svg?alt=media&token=b8056643-f136-436d-a48f-f08d46338d76'
      break
    case 'food-drumstick':
      iconSrc += isActive
        ? 'food-drumstickActive.svg?alt=media&token=8579560f-a064-4f2e-8446-2217a233cdd2'
        : 'food-drumstickInactive.svg?alt=media&token=86ec05a8-8a96-44a9-b96a-b6bfe9897d53'
      break
    case 'glass-cocktail':
      iconSrc += isActive
        ? 'glass-cocktailActive.svg?alt=media&token=33b73159-7657-4a11-a1b2-d10f6e9895d4'
        : 'glass-cocktailInactive.svg?alt=media&token=c6aafd29-fb40-4b7b-8c23-5c2078debe04'
      break
    case 'beer':
      iconSrc += isActive
        ? 'glass-mug-variantActive.svg?alt=media&token=deb22a9a-bccc-4570-8921-e0d6aa3951ca'
        : 'glass-mug-variantInactive.svg?alt=media&token=6dcbce76-4a53-4298-b4f8-35dfafe05fee'
      break
    case 'hamburger':
      iconSrc += isActive
        ? 'hamburgerActive.svg?alt=media&token=f706f127-98d8-4fd3-a71b-a58d5b441b8d'
        : 'hamburgerInactive.svg?alt=media&token=f0265e7f-42b9-4032-b9cc-311818b1a2ec'
      break
    case 'ice-cream':
      iconSrc += isActive
        ? 'ice-creamActive.svg?alt=media&token=f106ee60-21ef-48d3-922a-04bbd72062a5'
        : 'ice-creamInactive.svg?alt=media&token=62cf2c24-5178-480c-9c77-e387fa7603d0'
      break
    case 'muffin':
      iconSrc += isActive
        ? 'muffinActive.svg?alt=media&token=2cac0a3c-cfe1-4cf9-aebb-6c1194f9ebf8'
        : 'muffinInactive.svg?alt=media&token=3536693e-c815-4a17-acd5-6f631e2e28cd'
      break
    case 'pizza':
      iconSrc += isActive
        ? 'pizzaInactive.svg?alt=media&token=2fe11dc8-53bf-48dd-93c1-bac1a570d330'
        : 'pizzaInactive.svg?alt=media&token=2fe11dc8-53bf-48dd-93c1-bac1a570d330'
      break
    // case 'silverware':
    //   iconSrc += isActive
    //     ? 'silverwareActive.svg?alt=media&token=6455eddf-486c-4553-b5cc-c3203928cf46'
    //     : 'silverwareInactive.svg?alt=media&token=41e8fbaf-0e82-4c67-aa2f-9f0f51c8677c'
    //   break
    case 'tea':
      iconSrc += isActive
        ? 'teaActive.svg?alt=media&token=31cda790-d4be-479e-a2e0-bafc571ebae3'
        : 'teaInactive.svg?alt=media&token=89ebe801-d0d0-4408-be4b-1c5f778a7157'
      break
    default:
      break
  }
  return iconSrc
}

export default function findIcon(selectedIcon, eventType) {
  let currentArray
  // eslint-disable-next-line default-case
  switch (eventType) {
    case EVENT_TYPES[0]:
      currentArray = [...accomodation]
      break
    case EVENT_TYPES[1]:
      currentArray = [...flight]
      break
    case EVENT_TYPES[2]:
      currentArray = [...explore]
      break
    case EVENT_TYPES[3]:
      currentArray = [...transport]
      break
    case EVENT_TYPES[4]:
      currentArray = [...restaurant]
      break
    case 'tripIcon':
  }
  return currentArray?.filter(icon => icon.value === selectedIcon)[0].icon
}

export function getTransportIcons(transportArray) {
  return transportArray
    .filter((currentTransport, transportIndex) => {
      if (transportIndex > 3) {
        return false
      }
      return true
    })
    .map(currentTransport => findIcon(currentTransport.icon, EVENT_TYPES[3]))
}
