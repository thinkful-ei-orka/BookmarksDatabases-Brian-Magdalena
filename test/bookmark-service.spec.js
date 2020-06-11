const BookmarkService = require('../src/bookmark-service');
const knex = require('knex');

describe(`Bookmark List Service object`, function () {
  let db;
  let testItems = [
    {
      id: 1,
      title: 'First test item!',
      url: 'https://firsttestitem',
      description: 'first test items description',
      rating: 5
    },
    {
      id: 2,
      title: 'Second test item!',
      url: 'https://secondtestitem',
      description: 'second test items description',
      rating: 3
    },
    {
      id: 3,
      title: 'Third test item!',
      url: 'https://thirdtestitem',
      description: 'third test items description',
      rating: 2
    },
    {
      id: 4,
      title: 'Third test item!',
      url: 'https://fourthtestitem',
      description: 'fourth test items description',
      rating: 4
    },
  ];

  before(() => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL,
    });
  });

  before(() => db('bookmarks').truncate());

  afterEach(() => db('bookmarks').truncate());

  after(() => db.destroy());

  context(`Given 'bookmark' has data`, () => {
    beforeEach(() => {
      return db
        .into('bookmarks')
        .insert(testItems);
    });

    it(`getAllItems() resolves all items from 'bookmark' table`, () => {
      const expectedItems = testItems.map(item => ({
        ...item,
      }));
      return BookmarkService.getAllItems(db)
        .then(actual => {
          expect(actual).to.eql(expectedItems);
        });
    });

    it(`getById() resolves an item by id from 'bookmark' table`, () => {
      const idToGet = 3;
      const thirdItem = testItems[idToGet - 1];
      return BookmarkService.getById(db, idToGet)
        .then(actual => {
          expect(actual).to.eql({
            id: idToGet,
            title: thirdItem.title,
            url: thirdItem.url,
            description: thirdItem.description,
            rating: thirdItem.rating,
          });
        });
    });

    it(`deleteItem() removes an item by id from 'bookmark' table`, () => {
      const idToDelete = 3;
      return BookmarkService.deleteItem(db, idToDelete)
        .then(() => BookmarkService.getAllItems(db))
        .then(allItems => {
          // copy the test items array without the removed item
          const expected = testItems
            .filter(item => item.id !== idToDelete)
            .map(item => ({
              ...item,
            }));
          expect(allItems).to.eql(expected);
        });
    });

    it(`updateItem() updates an item in the 'bookmark' table`, () => {
      const idOfItemToUpdate = 3;
      const newItemData = {
        title: 'updated title',
        description: 'updated description',
        url: 'https://newurl',
        rating: 3,
      };
      const originalItem = testItems[idOfItemToUpdate - 1];
      return BookmarkService.updateItem(db, idOfItemToUpdate, newItemData)
        .then(() => BookmarkService.getById(db, idOfItemToUpdate))
        .then(item => {
          expect(item).to.eql({
            id: idOfItemToUpdate,
            ...originalItem,
            ...newItemData,
          });
        });
    });
  });

  context(`Given 'bookmark' has no data`, () => {
    it(`getAllItems() resolves an empty array`, () => {
      return BookmarkService.getAllItems(db)
        .then(actual => {
          expect(actual).to.eql([]);
        });
    });

    it(`insertItem() inserts an item and resolves it with an 'id'`, () => {
      const newItem = {
        title: 'Test new title title',
        description: 'new item description',
        url: 'https://newitemurl',
        rating: 4,
      };
      return BookmarkService.insertItem(db, newItem)
        .then(actual => {
          expect(actual).to.eql({
            id: 1,
            title: newItem.title,
            description: newItem.description,
            url: newItem.url,
            rating: newItem.rating,
          });
        });
    });
  });
});