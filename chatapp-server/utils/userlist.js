const userList = [];

const addUser = (id, username, room) => {
  // handle if username exists

  userList.push({ id, username, room });
  return userList;
};

const addUserToRoom = (room) => {
  return userList.filter((user) => user.room === room);
};

// if user with existing id leaves, remove from list
const removeUserFromRoom = (id) => {
  const index = userList.findIndex((foundUser) => foundUser.id === id);
  if (index !== -1) {
    return userList.splice(index, 1);
  }
};

const updatedUsers = (id) => {};

module.exports = { addUserToRoom, addUser, removeUserFromRoom };
