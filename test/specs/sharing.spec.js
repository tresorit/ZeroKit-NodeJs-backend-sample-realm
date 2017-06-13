const uid = require('uid2');

const test = require('../lib/test');
const c = require('../lib/common');

module.exports = function () {
  describe('Sharing', function () {
    let user1, user2;
    let token;
    let tresorId;
    let userId1 = null;
    let userId2 = null;

    beforeEach(() => {
      user1 = uid(8);
      user2 = uid(8);

      return Promise.all([
        c.register(user1, 'a'),
        c.register(user2, 'b')
      ]).then((res) => {
        userId1 = res[0];
        userId2 = res[1];
        return c.login(user1, 'a')
      })
        .then(() => c.tokenLogin())
        .then((id) => token = id)
        .then(() => c.createTresor(token))
        .then((id) => tresorId = id);
    });

    describe('shareTresor', () => {
      it('should add the new user to the members in db', () => {
        return c.shareTresor(tresorId, user2, token)
          .then(() => test.Tresor.findOne({id: tresorId}).should.eventually.be.ok)
          .then(tresor => ([
            tresor.members.should.include(userId1),
            tresor.members.should.include(userId2)
          ]));
      });

      it('should make the invitee able to encrypt with tresor after approval', () => {
        return c.shareTresor(tresorId, user2, token)
          .then(() => c.login(user2, 'b'))
          .then(() => test.client.whoAmI())
          .then(() => test.client.encrypt(tresorId, 'asdf'))
          .should.be.fulfilled;
      });
    });

    describe('kickFromTresor', () => {
      beforeEach(() => {
        return c.shareTresor(tresorId, user2, token);
      });

      it('should make the invitee not able to encrypt with tresor after approval', () => {
        return c.kickFromTresor(tresorId, user2, token)
          .then(() => c.login(user2, 'b'))
          .then(() =>
            test.client.encrypt(tresorId, 'asdf').should.be.rejected
          );
      });
    });
  });
};
