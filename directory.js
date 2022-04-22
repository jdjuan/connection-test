import * as ActiveDirectory from 'activedirectory';

class AuthService {
  activeDirectory;

  constructor() {
    this.activeDirectory = new ActiveDirectory.default({
      url: process.env.AD_TEST_LDAP_URL,
      baseDN: process.env.AD_TEST_LDAP_BASE_DN,
      username: process.env.AD_TEST_LDAP_USER_NAME,
      password: process.env.AD_TEST_LDAP_USER_PASSWORD,
    });
  }

  async authenticate(username, password) {
    return new Promise((resolve, reject) => {
      this.activeDirectory.authenticate(username, password, (error, auth) => {
        if (error) {
          console.log(error);

          reject(new Error('An error occured during Active Directory access'));
        }

        if (auth) {
          resolve(true);
        }

        reject(new Error('Authentication failed'));
      });
    });
  }

  async getUserGroups(username) {
    return new Promise((resolve, reject) => {
      this.activeDirectory.getGroupMembershipForUser(
        username,
        (error, groups) => {
          if (error) {
            console.log(error);
            reject(
              new Error('An error occured during while retreiving groups')
            );
          }

          if (!groups) {
            reject(new Error('User not found'));
          }

          resolve(groups);
        }
      );
    });
  }

  async getUsersInGroup(group) {
    return new Promise((resolve, reject) => {
      this.activeDirectory.getUsersForGroup(group, (error, users) => {
        if (error) {
          console.log(error);
          reject(
            new Error(
              'An error occured during while retreiving user in a group'
            )
          );
        }

        resolve(users);
      });
    });
  }
}

export const testActiveDirectory = () => {
  try {
    (async () => {
      const authService = new AuthService();
      console.log(
        `Can ${process.env.AD_TEST_AUTH_USER_LOGIN} access?`,
        await authService.authenticate(
          process.env.AD_TEST_AUTH_USER_LOGIN,
          process.env.AD_TEST_AUTH_USER_PASSWORD
        )
      );
      console.log(
        `${process.env.AD_TEST_USER_GROUPS}'s groups`,
        await authService.getUserGroups(process.env.AD_TEST_USER_GROUPS)
      );
      console.log(
        `Users in group ${process.env.AD_TEST_GROUP_USERS}`,
        await authService.getUsersInGroup(process.env.AD_TEST_GROUP_USERS)
      );
    })();
  } catch (error) {
    console.log('=======');
    console.log('ActiveDirectory Connection Failed');
    console.log(error);
  }
};
