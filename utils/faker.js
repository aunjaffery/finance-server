const { faker } = require("@faker-js/faker");

const fakeClients = () => {
  let arr = [];
  for (let i = 0; i < 80; i++) {
    arr.push({
      fullName: faker.name.fullName(),
      relation: faker.name.jobType(),
      user_id: 1,
    });
  }
  return arr;
};

module.exports = { fakeClients };
