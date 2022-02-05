import {
  InferSubjects,
  Ability,
  AbilityClass,
  AbilityBuilder,
  ExtractSubjectType,
} from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { Role, Action } from 'src/auth/enums/role.enum';
import { Department } from 'src/department/schemas/department.schema';
import { User } from 'src/user/schemas/user.schema';

type Subjects = InferSubjects<typeof Department | typeof User> | 'all';

export type AppAbility = Ability<[Action, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: User) {
    const { can, cannot, build } = new AbilityBuilder<
      Ability<[Action, Subjects]>
    >(Ability as AbilityClass<AppAbility>);

    if (user.role[0] === Role.SUPERADMIN) {
      can(Action.Manage, 'all'); // read-write access to everything
      can(Action.Delete, Department);
      can(Action.Update, Department);
    } else if (user.role[0] === Role.DEPARTMENTMANAGER) {
      can(Action.Read, 'all'); // read-only access to everything
    }

    //can(Action.Update, Department, { authorId: user.id });
    //cannot(Action.Delete, Department, { isPublished: true });

    return build({
      // Read https://casl.js.org/v5/en/guide/subject-type-detection#use-classes-as-subject-types for details
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
