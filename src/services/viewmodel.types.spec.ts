import {} from 'jasmine';
import { TypedJSON } from 'typedjson';

import { ApplicationViewModel, EconomyPageViewModel, GeneralInformation,
  ListPageViewModel, MenuViewModel, TechnicalInfoPageViewModel } from './viewmodel.types';

describe('ViewModel subtypes parsing from JSON', () => {

  describe('GeneralInformation', () => {
    it('Parses correct JSON', () => {
      const generalInfo = TypedJSON.parse('{ "maxSecondsInVr": 17 }', GeneralInformation);
      expect(generalInfo).toBeTruthy();
      expect(generalInfo.maxSecondsInVr).toEqual(17);
    });

    it('Throws for incorrect type of field', () => {
      expect(() => TypedJSON.parse('{ "maxSecondsInVr": "ALOT" }', GeneralInformation)).toThrow();
    });

    it('Throws for missing field', () => {
      expect(() => TypedJSON.parse('{}', GeneralInformation)).toThrow();
    });
  });

  describe('MenuViewmodel', () => {
    it('Parses correct JSON', () => {
      const menuViewModel = TypedJSON.parse('{ "characterName": "Petya Ivanov" }', MenuViewModel);
      expect(menuViewModel).toBeTruthy();
      expect(menuViewModel.characterName).toEqual('Petya Ivanov');
    });

    it('Throws for incorrect type of field', () => {
      expect(() => TypedJSON.parse('{ "characterName": 18 }', MenuViewModel)).toThrow();
    });

    it('Throws for missing field', () => {
      expect(() => TypedJSON.parse('{}', MenuViewModel)).toThrow();
    });
  });

  describe('ApplicationViewModel', () => {
    const exampleApplicationViewModel = `
    {
      "_id": "vasya",
      "timestamp": 1499970465030,
      "general": {
        "maxSecondsInVr": 1200
      },
      "menu": {
        "characterName": "Arnold Schwarzenegger"
      },
      "toolbar": {
        "hitPoints": 46,
        "maxHitPoints": 55
      },
      "passportScreen": {
        "id": "vasya",
        "fullName": "Arnold Schwarzenegger",
        "corporation": "Skynet",
        "email": "vasya2045@mail.ru"
      },
      "pages": [
        {
          "__type": "ListPageViewModel",
          "viewId": "page:general",
          "menuTitle": "Общая информация",
          "body": {
            "title": "Общая информация",
            "items": [
              {
                "text": "Имя",
                "value": "Arnold Schwarzenegger"
              },
              {
                "text": "ID",
                "value": "vasya"
              },
              {
                "text": "Пол",
                "value": "мужской"
              },
              {
                "text": "Возраст",
                "value": "82"
              },
              {
                "text": "Корпорация",
                "value": "Skynet"
              },
              {
                "text": "Hit Points",
                "value": "46 / 55",
                "percent": 83.63636363636364
              },
              {
                "text": "Ограничения движения",
                "value": "нет"
              }
            ]
          }
        },
        {
          "__type": "ListPageViewModel",
          "viewId": "page:memory",
          "menuTitle": "Воспоминания",
          "body": {
            "title": "Воспоминания",
            "items": [
              {
                "text": "Название воспоминания №1",
                "details": {
                  "header": "Название воспоминания №1",
                  "text": "Какие-то воспоминания о хрен знает чем...http://link-to-local-server.local/url"
                }
              },
              {
                "text": "Название воспоминания №2",
                "details": {
                  "header": "Название воспоминания №2",
                  "text": "http://link-to-local-server.local/url2"
                }
              }
            ]
          }
        },
        {
          "__type": "ListPageViewModel",
          "viewId": "page:conditions",
          "menuTitle": "Состояния",
          "body": {
            "title": "Ваши состояния",
            "items": [
              {
                "text": "Болит голова",
                "tag": "Физиология",
                "icon": "physiology",
                "details": {
                  "header": "Болит голова",
                  "text": ""
                }
              },
              {
                "text": "Тоска",
                "tag": "Психология",
                "icon": "mind",
                "details": {
                  "header": "Тоска",
                  "text": "Кажется, никто вас не любит."
                }
              },
              {
                "text": "Работает новый demo-имплант!",
                "tag": "Физиология",
                "icon": "physiology",
                "details": {
                  "header": "Работает новый demo-имплант!",
                  "text": "Вы ощущаете гордость, что эта штука в вашем теле работает!"
                }
              }
            ],
            "filters": [
              "Физиология",
              "Психология"
            ]
          }
        },
        {
          "__type": "ListPageViewModel",
          "viewId": "page:implants",
          "menuTitle": "Импланты",
          "body": {
            "title": "Импланты",
            "items": [
              {
                "text": "Мотор для сердца +2 HP",
                "value": "OFF",
                "valueColor": "#FF373F",
                "details": {
                  "header": "Мотор для сердца +2 HP",
                  "text": "Имплант Мотор для сердца +2 HP",
                  "actions": [
                    {
                      "text": "Включить",
                      "eventType": "enableImplant",
                      "data": {
                        "mID": "26267ae6-0f6c-4efd-8f98-37c2e09a42a2"
                      }
                    }
                  ]
                }
              },
              {
                "text": "Мотор для сердца +2 HP",
                "value": "OFF",
                "valueColor": "#FF373F",
                "details": {
                  "header": "Мотор для сердца +2 HP",
                  "text": "Имплант Мотор для сердца +2 HP",
                  "actions": [
                    {
                      "text": "Включить",
                      "eventType": "enableImplant",
                      "data": {
                        "mID": "cj3qwkjfc0002lwjsjkb226gm"
                      }
                    }
                  ]
                }
              },
              {
                "text": "Мотор для сердца +2 HP",
                "value": "ON",
                "valueColor": "",
                "details": {
                  "header": "Мотор для сердца +2 HP",
                  "text": "Имплант Мотор для сердца +2 HP",
                  "actions": [
                    {
                      "text": "Выключить",
                      "eventType": "disableImplant",
                      "data": {
                        "mID": "cj3qwks1p0000lqjsm7dk519d"
                      }
                    }
                  ]
                }
              }
            ]
          }
        },
        {
          "__type": "EconomyPageViewModel",
          "viewId": "page:economy",
          "menuTitle": "Экономика"
        },
        {
          "__type": "TechnicalInfoPageViewModel",
          "viewId": "page:technicalinfo",
          "menuTitle": "Техническая инфа"
        }
      ]
    }`;

    it('Parses correct JSON', () => {
      const applicationViewModel = TypedJSON.parse(exampleApplicationViewModel, ApplicationViewModel);
      expect(applicationViewModel).toBeTruthy();
      expect(applicationViewModel.pages.length).toEqual(6);
      for (let i = 0; i < 4; ++i) {
        expect(applicationViewModel.pages[i] instanceof ListPageViewModel).toBeTruthy();
        expect(applicationViewModel.pages[i].__type).toEqual('ListPageViewModel');
      }
      expect(applicationViewModel.pages[4] instanceof EconomyPageViewModel).toBeTruthy();
      expect(applicationViewModel.pages[4].__type).toEqual('EconomyPageViewModel');
      expect(applicationViewModel.pages[5] instanceof TechnicalInfoPageViewModel).toBeTruthy();
      expect(applicationViewModel.pages[5].__type).toEqual('TechnicalInfoPageViewModel');
      const listPageViewModel = applicationViewModel.pages[0] as ListPageViewModel;
      expect(listPageViewModel).toBeTruthy();
      expect(listPageViewModel.body).toBeTruthy();
    });

    // We introduce error deep inside of viewmodel - eventType of action is missing
    const exampleApplicationViewModelWithInvalidListPage =
    `{
      "_id": "vasya",
      "timestamp": 1499970465030,
      "general": {
        "maxSecondsInVr": 1200
      },
      "menu": {
        "characterName": "Arnold Schwarzenegger"
      },
      "toolbar": {
        "hitPoints": 46,
        "maxHitPoints": 55
      },
      "passportScreen": {
        "id": "vasya",
        "fullName": "Arnold Schwarzenegger",
        "corporation": "Skynet",
        "email": "vasya2045@mail.ru"
      },
      "pages": [
        {
          "__type": "ListPageViewModel",
          "menuTitle": "Импланты",
          "body": {
            "title": "Импланты",
            "items": [
              {
                "text": "Мотор для сердца +2 HP",
                "value": "OFF",
                "valueColor": "#FF373F",
                "details": {
                  "header": "Мотор для сердца +2 HP",
                  "text": "Имплант Мотор для сердца +2 HP",
                  "actions": [
                    {
                      "text": "Включить",
                      "data": {
                        "mID": "26267ae6-0f6c-4efd-8f98-37c2e09a42a2"
                      }
                    }
                  ]
                }
              },
            ]
          }
        }
      ]
    }`;

    it('Throws on incorrect JSON', () => {
      expect(() => TypedJSON.parse(exampleApplicationViewModelWithInvalidListPage, ApplicationViewModel)).toThrow();
    });
  });

});
