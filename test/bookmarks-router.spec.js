it('responds with 200 and the specified article', () => {
    const articleId = 2
    const expectedArticle = testArticles[articleId - 1]
    return supertest(app)
      .get(`/articles/${articleId}`)
      .expect(200, expectedArticle)
  })



    describe.only(`POST /articles`, () => {
    it(`creates an article, responding with 201 and the new article`,  function() {
        return supertest(app)
        .post('/articles')
        .send({
            title: 'Test new article',
            style: 'Listicle',
            content: 'Test new article content...'
        })
        .expect(201)
    })
    })
