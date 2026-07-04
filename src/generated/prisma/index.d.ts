
/**
 * Client
**/

import * as runtime from './runtime/client.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model SpaceType
 * 
 */
export type SpaceType = $Result.DefaultSelection<Prisma.$SpaceTypePayload>
/**
 * Model Amenity
 * 
 */
export type Amenity = $Result.DefaultSelection<Prisma.$AmenityPayload>
/**
 * Model Space
 * 
 */
export type Space = $Result.DefaultSelection<Prisma.$SpacePayload>
/**
 * Model SpaceImage
 * 
 */
export type SpaceImage = $Result.DefaultSelection<Prisma.$SpaceImagePayload>
/**
 * Model SpaceAmenity
 * 
 */
export type SpaceAmenity = $Result.DefaultSelection<Prisma.$SpaceAmenityPayload>
/**
 * Model Booking
 * 
 */
export type Booking = $Result.DefaultSelection<Prisma.$BookingPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const Role: {
  ADMIN: 'ADMIN',
  SELLER: 'SELLER',
  BUYER: 'BUYER'
};

export type Role = (typeof Role)[keyof typeof Role]


export const UserStatus: {
  ACTIVE: 'ACTIVE',
  SUSPENDED: 'SUSPENDED'
};

export type UserStatus = (typeof UserStatus)[keyof typeof UserStatus]


export const SpaceStatus: {
  DRAFT: 'DRAFT',
  PENDING_REVIEW: 'PENDING_REVIEW',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  INACTIVE: 'INACTIVE'
};

export type SpaceStatus = (typeof SpaceStatus)[keyof typeof SpaceStatus]


export const BookingStatus: {
  PENDING: 'PENDING',
  ACCEPTED: 'ACCEPTED',
  REJECTED: 'REJECTED',
  CANCELLED: 'CANCELLED',
  COMPLETED: 'COMPLETED'
};

export type BookingStatus = (typeof BookingStatus)[keyof typeof BookingStatus]

}

export type Role = $Enums.Role

export const Role: typeof $Enums.Role

export type UserStatus = $Enums.UserStatus

export const UserStatus: typeof $Enums.UserStatus

export type SpaceStatus = $Enums.SpaceStatus

export const SpaceStatus: typeof $Enums.SpaceStatus

export type BookingStatus = $Enums.BookingStatus

export const BookingStatus: typeof $Enums.BookingStatus

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient({
 *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
 * })
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://pris.ly/d/client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient({
   *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
   * })
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://pris.ly/d/client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/orm/prisma-client/queries/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>

  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.spaceType`: Exposes CRUD operations for the **SpaceType** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more SpaceTypes
    * const spaceTypes = await prisma.spaceType.findMany()
    * ```
    */
  get spaceType(): Prisma.SpaceTypeDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.amenity`: Exposes CRUD operations for the **Amenity** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Amenities
    * const amenities = await prisma.amenity.findMany()
    * ```
    */
  get amenity(): Prisma.AmenityDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.space`: Exposes CRUD operations for the **Space** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Spaces
    * const spaces = await prisma.space.findMany()
    * ```
    */
  get space(): Prisma.SpaceDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.spaceImage`: Exposes CRUD operations for the **SpaceImage** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more SpaceImages
    * const spaceImages = await prisma.spaceImage.findMany()
    * ```
    */
  get spaceImage(): Prisma.SpaceImageDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.spaceAmenity`: Exposes CRUD operations for the **SpaceAmenity** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more SpaceAmenities
    * const spaceAmenities = await prisma.spaceAmenity.findMany()
    * ```
    */
  get spaceAmenity(): Prisma.SpaceAmenityDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.booking`: Exposes CRUD operations for the **Booking** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Bookings
    * const bookings = await prisma.booking.findMany()
    * ```
    */
  get booking(): Prisma.BookingDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 7.8.0
   * Query Engine version: 3c6e192761c0362d496ed980de936e2f3cebcd3a
   */
  export type PrismaVersion = {
    client: string
    engine: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    User: 'User',
    SpaceType: 'SpaceType',
    Amenity: 'Amenity',
    Space: 'Space',
    SpaceImage: 'SpaceImage',
    SpaceAmenity: 'SpaceAmenity',
    Booking: 'Booking'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]



  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "user" | "spaceType" | "amenity" | "space" | "spaceImage" | "spaceAmenity" | "booking"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      SpaceType: {
        payload: Prisma.$SpaceTypePayload<ExtArgs>
        fields: Prisma.SpaceTypeFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SpaceTypeFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SpaceTypePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SpaceTypeFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SpaceTypePayload>
          }
          findFirst: {
            args: Prisma.SpaceTypeFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SpaceTypePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SpaceTypeFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SpaceTypePayload>
          }
          findMany: {
            args: Prisma.SpaceTypeFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SpaceTypePayload>[]
          }
          create: {
            args: Prisma.SpaceTypeCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SpaceTypePayload>
          }
          createMany: {
            args: Prisma.SpaceTypeCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SpaceTypeCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SpaceTypePayload>[]
          }
          delete: {
            args: Prisma.SpaceTypeDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SpaceTypePayload>
          }
          update: {
            args: Prisma.SpaceTypeUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SpaceTypePayload>
          }
          deleteMany: {
            args: Prisma.SpaceTypeDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SpaceTypeUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.SpaceTypeUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SpaceTypePayload>[]
          }
          upsert: {
            args: Prisma.SpaceTypeUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SpaceTypePayload>
          }
          aggregate: {
            args: Prisma.SpaceTypeAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSpaceType>
          }
          groupBy: {
            args: Prisma.SpaceTypeGroupByArgs<ExtArgs>
            result: $Utils.Optional<SpaceTypeGroupByOutputType>[]
          }
          count: {
            args: Prisma.SpaceTypeCountArgs<ExtArgs>
            result: $Utils.Optional<SpaceTypeCountAggregateOutputType> | number
          }
        }
      }
      Amenity: {
        payload: Prisma.$AmenityPayload<ExtArgs>
        fields: Prisma.AmenityFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AmenityFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AmenityPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AmenityFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AmenityPayload>
          }
          findFirst: {
            args: Prisma.AmenityFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AmenityPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AmenityFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AmenityPayload>
          }
          findMany: {
            args: Prisma.AmenityFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AmenityPayload>[]
          }
          create: {
            args: Prisma.AmenityCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AmenityPayload>
          }
          createMany: {
            args: Prisma.AmenityCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AmenityCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AmenityPayload>[]
          }
          delete: {
            args: Prisma.AmenityDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AmenityPayload>
          }
          update: {
            args: Prisma.AmenityUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AmenityPayload>
          }
          deleteMany: {
            args: Prisma.AmenityDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AmenityUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AmenityUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AmenityPayload>[]
          }
          upsert: {
            args: Prisma.AmenityUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AmenityPayload>
          }
          aggregate: {
            args: Prisma.AmenityAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAmenity>
          }
          groupBy: {
            args: Prisma.AmenityGroupByArgs<ExtArgs>
            result: $Utils.Optional<AmenityGroupByOutputType>[]
          }
          count: {
            args: Prisma.AmenityCountArgs<ExtArgs>
            result: $Utils.Optional<AmenityCountAggregateOutputType> | number
          }
        }
      }
      Space: {
        payload: Prisma.$SpacePayload<ExtArgs>
        fields: Prisma.SpaceFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SpaceFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SpacePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SpaceFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SpacePayload>
          }
          findFirst: {
            args: Prisma.SpaceFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SpacePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SpaceFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SpacePayload>
          }
          findMany: {
            args: Prisma.SpaceFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SpacePayload>[]
          }
          create: {
            args: Prisma.SpaceCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SpacePayload>
          }
          createMany: {
            args: Prisma.SpaceCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SpaceCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SpacePayload>[]
          }
          delete: {
            args: Prisma.SpaceDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SpacePayload>
          }
          update: {
            args: Prisma.SpaceUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SpacePayload>
          }
          deleteMany: {
            args: Prisma.SpaceDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SpaceUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.SpaceUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SpacePayload>[]
          }
          upsert: {
            args: Prisma.SpaceUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SpacePayload>
          }
          aggregate: {
            args: Prisma.SpaceAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSpace>
          }
          groupBy: {
            args: Prisma.SpaceGroupByArgs<ExtArgs>
            result: $Utils.Optional<SpaceGroupByOutputType>[]
          }
          count: {
            args: Prisma.SpaceCountArgs<ExtArgs>
            result: $Utils.Optional<SpaceCountAggregateOutputType> | number
          }
        }
      }
      SpaceImage: {
        payload: Prisma.$SpaceImagePayload<ExtArgs>
        fields: Prisma.SpaceImageFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SpaceImageFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SpaceImagePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SpaceImageFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SpaceImagePayload>
          }
          findFirst: {
            args: Prisma.SpaceImageFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SpaceImagePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SpaceImageFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SpaceImagePayload>
          }
          findMany: {
            args: Prisma.SpaceImageFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SpaceImagePayload>[]
          }
          create: {
            args: Prisma.SpaceImageCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SpaceImagePayload>
          }
          createMany: {
            args: Prisma.SpaceImageCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SpaceImageCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SpaceImagePayload>[]
          }
          delete: {
            args: Prisma.SpaceImageDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SpaceImagePayload>
          }
          update: {
            args: Prisma.SpaceImageUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SpaceImagePayload>
          }
          deleteMany: {
            args: Prisma.SpaceImageDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SpaceImageUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.SpaceImageUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SpaceImagePayload>[]
          }
          upsert: {
            args: Prisma.SpaceImageUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SpaceImagePayload>
          }
          aggregate: {
            args: Prisma.SpaceImageAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSpaceImage>
          }
          groupBy: {
            args: Prisma.SpaceImageGroupByArgs<ExtArgs>
            result: $Utils.Optional<SpaceImageGroupByOutputType>[]
          }
          count: {
            args: Prisma.SpaceImageCountArgs<ExtArgs>
            result: $Utils.Optional<SpaceImageCountAggregateOutputType> | number
          }
        }
      }
      SpaceAmenity: {
        payload: Prisma.$SpaceAmenityPayload<ExtArgs>
        fields: Prisma.SpaceAmenityFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SpaceAmenityFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SpaceAmenityPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SpaceAmenityFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SpaceAmenityPayload>
          }
          findFirst: {
            args: Prisma.SpaceAmenityFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SpaceAmenityPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SpaceAmenityFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SpaceAmenityPayload>
          }
          findMany: {
            args: Prisma.SpaceAmenityFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SpaceAmenityPayload>[]
          }
          create: {
            args: Prisma.SpaceAmenityCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SpaceAmenityPayload>
          }
          createMany: {
            args: Prisma.SpaceAmenityCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SpaceAmenityCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SpaceAmenityPayload>[]
          }
          delete: {
            args: Prisma.SpaceAmenityDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SpaceAmenityPayload>
          }
          update: {
            args: Prisma.SpaceAmenityUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SpaceAmenityPayload>
          }
          deleteMany: {
            args: Prisma.SpaceAmenityDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SpaceAmenityUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.SpaceAmenityUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SpaceAmenityPayload>[]
          }
          upsert: {
            args: Prisma.SpaceAmenityUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SpaceAmenityPayload>
          }
          aggregate: {
            args: Prisma.SpaceAmenityAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSpaceAmenity>
          }
          groupBy: {
            args: Prisma.SpaceAmenityGroupByArgs<ExtArgs>
            result: $Utils.Optional<SpaceAmenityGroupByOutputType>[]
          }
          count: {
            args: Prisma.SpaceAmenityCountArgs<ExtArgs>
            result: $Utils.Optional<SpaceAmenityCountAggregateOutputType> | number
          }
        }
      }
      Booking: {
        payload: Prisma.$BookingPayload<ExtArgs>
        fields: Prisma.BookingFieldRefs
        operations: {
          findUnique: {
            args: Prisma.BookingFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookingPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.BookingFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookingPayload>
          }
          findFirst: {
            args: Prisma.BookingFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookingPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.BookingFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookingPayload>
          }
          findMany: {
            args: Prisma.BookingFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookingPayload>[]
          }
          create: {
            args: Prisma.BookingCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookingPayload>
          }
          createMany: {
            args: Prisma.BookingCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.BookingCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookingPayload>[]
          }
          delete: {
            args: Prisma.BookingDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookingPayload>
          }
          update: {
            args: Prisma.BookingUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookingPayload>
          }
          deleteMany: {
            args: Prisma.BookingDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.BookingUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.BookingUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookingPayload>[]
          }
          upsert: {
            args: Prisma.BookingUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookingPayload>
          }
          aggregate: {
            args: Prisma.BookingAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateBooking>
          }
          groupBy: {
            args: Prisma.BookingGroupByArgs<ExtArgs>
            result: $Utils.Optional<BookingGroupByOutputType>[]
          }
          count: {
            args: Prisma.BookingCountArgs<ExtArgs>
            result: $Utils.Optional<BookingCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://pris.ly/d/logging).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory
    /**
     * Prisma Accelerate URL allowing the client to connect through Accelerate instead of a direct database.
     */
    accelerateUrl?: string
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
    /**
     * SQL commenter plugins that add metadata to SQL queries as comments.
     * Comments follow the sqlcommenter format: https://google.github.io/sqlcommenter/
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   adapter,
     *   comments: [
     *     traceContext(),
     *     queryInsights(),
     *   ],
     * })
     * ```
     */
    comments?: runtime.SqlCommenterPlugin[]
  }
  export type GlobalOmitConfig = {
    user?: UserOmit
    spaceType?: SpaceTypeOmit
    amenity?: AmenityOmit
    space?: SpaceOmit
    spaceImage?: SpaceImageOmit
    spaceAmenity?: SpaceAmenityOmit
    booking?: BookingOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    spaces: number
    bookings: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    spaces?: boolean | UserCountOutputTypeCountSpacesArgs
    bookings?: boolean | UserCountOutputTypeCountBookingsArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountSpacesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SpaceWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountBookingsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BookingWhereInput
  }


  /**
   * Count Type SpaceTypeCountOutputType
   */

  export type SpaceTypeCountOutputType = {
    spaces: number
  }

  export type SpaceTypeCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    spaces?: boolean | SpaceTypeCountOutputTypeCountSpacesArgs
  }

  // Custom InputTypes
  /**
   * SpaceTypeCountOutputType without action
   */
  export type SpaceTypeCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SpaceTypeCountOutputType
     */
    select?: SpaceTypeCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * SpaceTypeCountOutputType without action
   */
  export type SpaceTypeCountOutputTypeCountSpacesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SpaceWhereInput
  }


  /**
   * Count Type AmenityCountOutputType
   */

  export type AmenityCountOutputType = {
    spaces: number
  }

  export type AmenityCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    spaces?: boolean | AmenityCountOutputTypeCountSpacesArgs
  }

  // Custom InputTypes
  /**
   * AmenityCountOutputType without action
   */
  export type AmenityCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AmenityCountOutputType
     */
    select?: AmenityCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * AmenityCountOutputType without action
   */
  export type AmenityCountOutputTypeCountSpacesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SpaceAmenityWhereInput
  }


  /**
   * Count Type SpaceCountOutputType
   */

  export type SpaceCountOutputType = {
    images: number
    amenities: number
    bookings: number
  }

  export type SpaceCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    images?: boolean | SpaceCountOutputTypeCountImagesArgs
    amenities?: boolean | SpaceCountOutputTypeCountAmenitiesArgs
    bookings?: boolean | SpaceCountOutputTypeCountBookingsArgs
  }

  // Custom InputTypes
  /**
   * SpaceCountOutputType without action
   */
  export type SpaceCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SpaceCountOutputType
     */
    select?: SpaceCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * SpaceCountOutputType without action
   */
  export type SpaceCountOutputTypeCountImagesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SpaceImageWhereInput
  }

  /**
   * SpaceCountOutputType without action
   */
  export type SpaceCountOutputTypeCountAmenitiesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SpaceAmenityWhereInput
  }

  /**
   * SpaceCountOutputType without action
   */
  export type SpaceCountOutputTypeCountBookingsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BookingWhereInput
  }


  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    name: string | null
    email: string | null
    phone: string | null
    password: string | null
    role: $Enums.Role | null
    status: $Enums.UserStatus | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    name: string | null
    email: string | null
    phone: string | null
    password: string | null
    role: $Enums.Role | null
    status: $Enums.UserStatus | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    name: number
    email: number
    phone: number
    password: number
    role: number
    status: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type UserMinAggregateInputType = {
    id?: true
    name?: true
    email?: true
    phone?: true
    password?: true
    role?: true
    status?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    name?: true
    email?: true
    phone?: true
    password?: true
    role?: true
    status?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    name?: true
    email?: true
    phone?: true
    password?: true
    role?: true
    status?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    name: string
    email: string
    phone: string | null
    password: string
    role: $Enums.Role
    status: $Enums.UserStatus
    createdAt: Date
    updatedAt: Date
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    phone?: boolean
    password?: boolean
    role?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    spaces?: boolean | User$spacesArgs<ExtArgs>
    bookings?: boolean | User$bookingsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    phone?: boolean
    password?: boolean
    role?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    phone?: boolean
    password?: boolean
    role?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    name?: boolean
    email?: boolean
    phone?: boolean
    password?: boolean
    role?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "email" | "phone" | "password" | "role" | "status" | "createdAt" | "updatedAt", ExtArgs["result"]["user"]>
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    spaces?: boolean | User$spacesArgs<ExtArgs>
    bookings?: boolean | User$bookingsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type UserIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      spaces: Prisma.$SpacePayload<ExtArgs>[]
      bookings: Prisma.$BookingPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      email: string
      phone: string | null
      password: string
      role: $Enums.Role
      status: $Enums.UserStatus
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {UserUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Users and only return the `id`
     * const userWithIdOnly = await prisma.user.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(args: SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    spaces<T extends User$spacesArgs<ExtArgs> = {}>(args?: Subset<T, User$spacesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SpacePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    bookings<T extends User$bookingsArgs<ExtArgs> = {}>(args?: Subset<T, User$bookingsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BookingPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly name: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly phone: FieldRef<"User", 'String'>
    readonly password: FieldRef<"User", 'String'>
    readonly role: FieldRef<"User", 'Role'>
    readonly status: FieldRef<"User", 'UserStatus'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
    readonly updatedAt: FieldRef<"User", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User updateManyAndReturn
   */
  export type UserUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * User.spaces
   */
  export type User$spacesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Space
     */
    select?: SpaceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Space
     */
    omit?: SpaceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SpaceInclude<ExtArgs> | null
    where?: SpaceWhereInput
    orderBy?: SpaceOrderByWithRelationInput | SpaceOrderByWithRelationInput[]
    cursor?: SpaceWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SpaceScalarFieldEnum | SpaceScalarFieldEnum[]
  }

  /**
   * User.bookings
   */
  export type User$bookingsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Booking
     */
    select?: BookingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Booking
     */
    omit?: BookingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingInclude<ExtArgs> | null
    where?: BookingWhereInput
    orderBy?: BookingOrderByWithRelationInput | BookingOrderByWithRelationInput[]
    cursor?: BookingWhereUniqueInput
    take?: number
    skip?: number
    distinct?: BookingScalarFieldEnum | BookingScalarFieldEnum[]
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model SpaceType
   */

  export type AggregateSpaceType = {
    _count: SpaceTypeCountAggregateOutputType | null
    _min: SpaceTypeMinAggregateOutputType | null
    _max: SpaceTypeMaxAggregateOutputType | null
  }

  export type SpaceTypeMinAggregateOutputType = {
    id: string | null
    name: string | null
  }

  export type SpaceTypeMaxAggregateOutputType = {
    id: string | null
    name: string | null
  }

  export type SpaceTypeCountAggregateOutputType = {
    id: number
    name: number
    _all: number
  }


  export type SpaceTypeMinAggregateInputType = {
    id?: true
    name?: true
  }

  export type SpaceTypeMaxAggregateInputType = {
    id?: true
    name?: true
  }

  export type SpaceTypeCountAggregateInputType = {
    id?: true
    name?: true
    _all?: true
  }

  export type SpaceTypeAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SpaceType to aggregate.
     */
    where?: SpaceTypeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SpaceTypes to fetch.
     */
    orderBy?: SpaceTypeOrderByWithRelationInput | SpaceTypeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SpaceTypeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SpaceTypes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SpaceTypes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned SpaceTypes
    **/
    _count?: true | SpaceTypeCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SpaceTypeMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SpaceTypeMaxAggregateInputType
  }

  export type GetSpaceTypeAggregateType<T extends SpaceTypeAggregateArgs> = {
        [P in keyof T & keyof AggregateSpaceType]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSpaceType[P]>
      : GetScalarType<T[P], AggregateSpaceType[P]>
  }




  export type SpaceTypeGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SpaceTypeWhereInput
    orderBy?: SpaceTypeOrderByWithAggregationInput | SpaceTypeOrderByWithAggregationInput[]
    by: SpaceTypeScalarFieldEnum[] | SpaceTypeScalarFieldEnum
    having?: SpaceTypeScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SpaceTypeCountAggregateInputType | true
    _min?: SpaceTypeMinAggregateInputType
    _max?: SpaceTypeMaxAggregateInputType
  }

  export type SpaceTypeGroupByOutputType = {
    id: string
    name: string
    _count: SpaceTypeCountAggregateOutputType | null
    _min: SpaceTypeMinAggregateOutputType | null
    _max: SpaceTypeMaxAggregateOutputType | null
  }

  type GetSpaceTypeGroupByPayload<T extends SpaceTypeGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SpaceTypeGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SpaceTypeGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SpaceTypeGroupByOutputType[P]>
            : GetScalarType<T[P], SpaceTypeGroupByOutputType[P]>
        }
      >
    >


  export type SpaceTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    spaces?: boolean | SpaceType$spacesArgs<ExtArgs>
    _count?: boolean | SpaceTypeCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["spaceType"]>

  export type SpaceTypeSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
  }, ExtArgs["result"]["spaceType"]>

  export type SpaceTypeSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
  }, ExtArgs["result"]["spaceType"]>

  export type SpaceTypeSelectScalar = {
    id?: boolean
    name?: boolean
  }

  export type SpaceTypeOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name", ExtArgs["result"]["spaceType"]>
  export type SpaceTypeInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    spaces?: boolean | SpaceType$spacesArgs<ExtArgs>
    _count?: boolean | SpaceTypeCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type SpaceTypeIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type SpaceTypeIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $SpaceTypePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "SpaceType"
    objects: {
      spaces: Prisma.$SpacePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
    }, ExtArgs["result"]["spaceType"]>
    composites: {}
  }

  type SpaceTypeGetPayload<S extends boolean | null | undefined | SpaceTypeDefaultArgs> = $Result.GetResult<Prisma.$SpaceTypePayload, S>

  type SpaceTypeCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SpaceTypeFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SpaceTypeCountAggregateInputType | true
    }

  export interface SpaceTypeDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['SpaceType'], meta: { name: 'SpaceType' } }
    /**
     * Find zero or one SpaceType that matches the filter.
     * @param {SpaceTypeFindUniqueArgs} args - Arguments to find a SpaceType
     * @example
     * // Get one SpaceType
     * const spaceType = await prisma.spaceType.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SpaceTypeFindUniqueArgs>(args: SelectSubset<T, SpaceTypeFindUniqueArgs<ExtArgs>>): Prisma__SpaceTypeClient<$Result.GetResult<Prisma.$SpaceTypePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one SpaceType that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SpaceTypeFindUniqueOrThrowArgs} args - Arguments to find a SpaceType
     * @example
     * // Get one SpaceType
     * const spaceType = await prisma.spaceType.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SpaceTypeFindUniqueOrThrowArgs>(args: SelectSubset<T, SpaceTypeFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SpaceTypeClient<$Result.GetResult<Prisma.$SpaceTypePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SpaceType that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SpaceTypeFindFirstArgs} args - Arguments to find a SpaceType
     * @example
     * // Get one SpaceType
     * const spaceType = await prisma.spaceType.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SpaceTypeFindFirstArgs>(args?: SelectSubset<T, SpaceTypeFindFirstArgs<ExtArgs>>): Prisma__SpaceTypeClient<$Result.GetResult<Prisma.$SpaceTypePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SpaceType that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SpaceTypeFindFirstOrThrowArgs} args - Arguments to find a SpaceType
     * @example
     * // Get one SpaceType
     * const spaceType = await prisma.spaceType.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SpaceTypeFindFirstOrThrowArgs>(args?: SelectSubset<T, SpaceTypeFindFirstOrThrowArgs<ExtArgs>>): Prisma__SpaceTypeClient<$Result.GetResult<Prisma.$SpaceTypePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more SpaceTypes that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SpaceTypeFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all SpaceTypes
     * const spaceTypes = await prisma.spaceType.findMany()
     * 
     * // Get first 10 SpaceTypes
     * const spaceTypes = await prisma.spaceType.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const spaceTypeWithIdOnly = await prisma.spaceType.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SpaceTypeFindManyArgs>(args?: SelectSubset<T, SpaceTypeFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SpaceTypePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a SpaceType.
     * @param {SpaceTypeCreateArgs} args - Arguments to create a SpaceType.
     * @example
     * // Create one SpaceType
     * const SpaceType = await prisma.spaceType.create({
     *   data: {
     *     // ... data to create a SpaceType
     *   }
     * })
     * 
     */
    create<T extends SpaceTypeCreateArgs>(args: SelectSubset<T, SpaceTypeCreateArgs<ExtArgs>>): Prisma__SpaceTypeClient<$Result.GetResult<Prisma.$SpaceTypePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many SpaceTypes.
     * @param {SpaceTypeCreateManyArgs} args - Arguments to create many SpaceTypes.
     * @example
     * // Create many SpaceTypes
     * const spaceType = await prisma.spaceType.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SpaceTypeCreateManyArgs>(args?: SelectSubset<T, SpaceTypeCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many SpaceTypes and returns the data saved in the database.
     * @param {SpaceTypeCreateManyAndReturnArgs} args - Arguments to create many SpaceTypes.
     * @example
     * // Create many SpaceTypes
     * const spaceType = await prisma.spaceType.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many SpaceTypes and only return the `id`
     * const spaceTypeWithIdOnly = await prisma.spaceType.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SpaceTypeCreateManyAndReturnArgs>(args?: SelectSubset<T, SpaceTypeCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SpaceTypePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a SpaceType.
     * @param {SpaceTypeDeleteArgs} args - Arguments to delete one SpaceType.
     * @example
     * // Delete one SpaceType
     * const SpaceType = await prisma.spaceType.delete({
     *   where: {
     *     // ... filter to delete one SpaceType
     *   }
     * })
     * 
     */
    delete<T extends SpaceTypeDeleteArgs>(args: SelectSubset<T, SpaceTypeDeleteArgs<ExtArgs>>): Prisma__SpaceTypeClient<$Result.GetResult<Prisma.$SpaceTypePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one SpaceType.
     * @param {SpaceTypeUpdateArgs} args - Arguments to update one SpaceType.
     * @example
     * // Update one SpaceType
     * const spaceType = await prisma.spaceType.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SpaceTypeUpdateArgs>(args: SelectSubset<T, SpaceTypeUpdateArgs<ExtArgs>>): Prisma__SpaceTypeClient<$Result.GetResult<Prisma.$SpaceTypePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more SpaceTypes.
     * @param {SpaceTypeDeleteManyArgs} args - Arguments to filter SpaceTypes to delete.
     * @example
     * // Delete a few SpaceTypes
     * const { count } = await prisma.spaceType.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SpaceTypeDeleteManyArgs>(args?: SelectSubset<T, SpaceTypeDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SpaceTypes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SpaceTypeUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many SpaceTypes
     * const spaceType = await prisma.spaceType.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SpaceTypeUpdateManyArgs>(args: SelectSubset<T, SpaceTypeUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SpaceTypes and returns the data updated in the database.
     * @param {SpaceTypeUpdateManyAndReturnArgs} args - Arguments to update many SpaceTypes.
     * @example
     * // Update many SpaceTypes
     * const spaceType = await prisma.spaceType.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more SpaceTypes and only return the `id`
     * const spaceTypeWithIdOnly = await prisma.spaceType.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends SpaceTypeUpdateManyAndReturnArgs>(args: SelectSubset<T, SpaceTypeUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SpaceTypePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one SpaceType.
     * @param {SpaceTypeUpsertArgs} args - Arguments to update or create a SpaceType.
     * @example
     * // Update or create a SpaceType
     * const spaceType = await prisma.spaceType.upsert({
     *   create: {
     *     // ... data to create a SpaceType
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the SpaceType we want to update
     *   }
     * })
     */
    upsert<T extends SpaceTypeUpsertArgs>(args: SelectSubset<T, SpaceTypeUpsertArgs<ExtArgs>>): Prisma__SpaceTypeClient<$Result.GetResult<Prisma.$SpaceTypePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of SpaceTypes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SpaceTypeCountArgs} args - Arguments to filter SpaceTypes to count.
     * @example
     * // Count the number of SpaceTypes
     * const count = await prisma.spaceType.count({
     *   where: {
     *     // ... the filter for the SpaceTypes we want to count
     *   }
     * })
    **/
    count<T extends SpaceTypeCountArgs>(
      args?: Subset<T, SpaceTypeCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SpaceTypeCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a SpaceType.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SpaceTypeAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SpaceTypeAggregateArgs>(args: Subset<T, SpaceTypeAggregateArgs>): Prisma.PrismaPromise<GetSpaceTypeAggregateType<T>>

    /**
     * Group by SpaceType.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SpaceTypeGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SpaceTypeGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SpaceTypeGroupByArgs['orderBy'] }
        : { orderBy?: SpaceTypeGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SpaceTypeGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSpaceTypeGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the SpaceType model
   */
  readonly fields: SpaceTypeFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for SpaceType.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SpaceTypeClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    spaces<T extends SpaceType$spacesArgs<ExtArgs> = {}>(args?: Subset<T, SpaceType$spacesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SpacePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the SpaceType model
   */
  interface SpaceTypeFieldRefs {
    readonly id: FieldRef<"SpaceType", 'String'>
    readonly name: FieldRef<"SpaceType", 'String'>
  }
    

  // Custom InputTypes
  /**
   * SpaceType findUnique
   */
  export type SpaceTypeFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SpaceType
     */
    select?: SpaceTypeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SpaceType
     */
    omit?: SpaceTypeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SpaceTypeInclude<ExtArgs> | null
    /**
     * Filter, which SpaceType to fetch.
     */
    where: SpaceTypeWhereUniqueInput
  }

  /**
   * SpaceType findUniqueOrThrow
   */
  export type SpaceTypeFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SpaceType
     */
    select?: SpaceTypeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SpaceType
     */
    omit?: SpaceTypeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SpaceTypeInclude<ExtArgs> | null
    /**
     * Filter, which SpaceType to fetch.
     */
    where: SpaceTypeWhereUniqueInput
  }

  /**
   * SpaceType findFirst
   */
  export type SpaceTypeFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SpaceType
     */
    select?: SpaceTypeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SpaceType
     */
    omit?: SpaceTypeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SpaceTypeInclude<ExtArgs> | null
    /**
     * Filter, which SpaceType to fetch.
     */
    where?: SpaceTypeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SpaceTypes to fetch.
     */
    orderBy?: SpaceTypeOrderByWithRelationInput | SpaceTypeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SpaceTypes.
     */
    cursor?: SpaceTypeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SpaceTypes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SpaceTypes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SpaceTypes.
     */
    distinct?: SpaceTypeScalarFieldEnum | SpaceTypeScalarFieldEnum[]
  }

  /**
   * SpaceType findFirstOrThrow
   */
  export type SpaceTypeFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SpaceType
     */
    select?: SpaceTypeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SpaceType
     */
    omit?: SpaceTypeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SpaceTypeInclude<ExtArgs> | null
    /**
     * Filter, which SpaceType to fetch.
     */
    where?: SpaceTypeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SpaceTypes to fetch.
     */
    orderBy?: SpaceTypeOrderByWithRelationInput | SpaceTypeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SpaceTypes.
     */
    cursor?: SpaceTypeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SpaceTypes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SpaceTypes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SpaceTypes.
     */
    distinct?: SpaceTypeScalarFieldEnum | SpaceTypeScalarFieldEnum[]
  }

  /**
   * SpaceType findMany
   */
  export type SpaceTypeFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SpaceType
     */
    select?: SpaceTypeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SpaceType
     */
    omit?: SpaceTypeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SpaceTypeInclude<ExtArgs> | null
    /**
     * Filter, which SpaceTypes to fetch.
     */
    where?: SpaceTypeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SpaceTypes to fetch.
     */
    orderBy?: SpaceTypeOrderByWithRelationInput | SpaceTypeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing SpaceTypes.
     */
    cursor?: SpaceTypeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SpaceTypes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SpaceTypes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SpaceTypes.
     */
    distinct?: SpaceTypeScalarFieldEnum | SpaceTypeScalarFieldEnum[]
  }

  /**
   * SpaceType create
   */
  export type SpaceTypeCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SpaceType
     */
    select?: SpaceTypeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SpaceType
     */
    omit?: SpaceTypeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SpaceTypeInclude<ExtArgs> | null
    /**
     * The data needed to create a SpaceType.
     */
    data: XOR<SpaceTypeCreateInput, SpaceTypeUncheckedCreateInput>
  }

  /**
   * SpaceType createMany
   */
  export type SpaceTypeCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many SpaceTypes.
     */
    data: SpaceTypeCreateManyInput | SpaceTypeCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SpaceType createManyAndReturn
   */
  export type SpaceTypeCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SpaceType
     */
    select?: SpaceTypeSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SpaceType
     */
    omit?: SpaceTypeOmit<ExtArgs> | null
    /**
     * The data used to create many SpaceTypes.
     */
    data: SpaceTypeCreateManyInput | SpaceTypeCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SpaceType update
   */
  export type SpaceTypeUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SpaceType
     */
    select?: SpaceTypeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SpaceType
     */
    omit?: SpaceTypeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SpaceTypeInclude<ExtArgs> | null
    /**
     * The data needed to update a SpaceType.
     */
    data: XOR<SpaceTypeUpdateInput, SpaceTypeUncheckedUpdateInput>
    /**
     * Choose, which SpaceType to update.
     */
    where: SpaceTypeWhereUniqueInput
  }

  /**
   * SpaceType updateMany
   */
  export type SpaceTypeUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update SpaceTypes.
     */
    data: XOR<SpaceTypeUpdateManyMutationInput, SpaceTypeUncheckedUpdateManyInput>
    /**
     * Filter which SpaceTypes to update
     */
    where?: SpaceTypeWhereInput
    /**
     * Limit how many SpaceTypes to update.
     */
    limit?: number
  }

  /**
   * SpaceType updateManyAndReturn
   */
  export type SpaceTypeUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SpaceType
     */
    select?: SpaceTypeSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SpaceType
     */
    omit?: SpaceTypeOmit<ExtArgs> | null
    /**
     * The data used to update SpaceTypes.
     */
    data: XOR<SpaceTypeUpdateManyMutationInput, SpaceTypeUncheckedUpdateManyInput>
    /**
     * Filter which SpaceTypes to update
     */
    where?: SpaceTypeWhereInput
    /**
     * Limit how many SpaceTypes to update.
     */
    limit?: number
  }

  /**
   * SpaceType upsert
   */
  export type SpaceTypeUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SpaceType
     */
    select?: SpaceTypeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SpaceType
     */
    omit?: SpaceTypeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SpaceTypeInclude<ExtArgs> | null
    /**
     * The filter to search for the SpaceType to update in case it exists.
     */
    where: SpaceTypeWhereUniqueInput
    /**
     * In case the SpaceType found by the `where` argument doesn't exist, create a new SpaceType with this data.
     */
    create: XOR<SpaceTypeCreateInput, SpaceTypeUncheckedCreateInput>
    /**
     * In case the SpaceType was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SpaceTypeUpdateInput, SpaceTypeUncheckedUpdateInput>
  }

  /**
   * SpaceType delete
   */
  export type SpaceTypeDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SpaceType
     */
    select?: SpaceTypeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SpaceType
     */
    omit?: SpaceTypeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SpaceTypeInclude<ExtArgs> | null
    /**
     * Filter which SpaceType to delete.
     */
    where: SpaceTypeWhereUniqueInput
  }

  /**
   * SpaceType deleteMany
   */
  export type SpaceTypeDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SpaceTypes to delete
     */
    where?: SpaceTypeWhereInput
    /**
     * Limit how many SpaceTypes to delete.
     */
    limit?: number
  }

  /**
   * SpaceType.spaces
   */
  export type SpaceType$spacesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Space
     */
    select?: SpaceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Space
     */
    omit?: SpaceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SpaceInclude<ExtArgs> | null
    where?: SpaceWhereInput
    orderBy?: SpaceOrderByWithRelationInput | SpaceOrderByWithRelationInput[]
    cursor?: SpaceWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SpaceScalarFieldEnum | SpaceScalarFieldEnum[]
  }

  /**
   * SpaceType without action
   */
  export type SpaceTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SpaceType
     */
    select?: SpaceTypeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SpaceType
     */
    omit?: SpaceTypeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SpaceTypeInclude<ExtArgs> | null
  }


  /**
   * Model Amenity
   */

  export type AggregateAmenity = {
    _count: AmenityCountAggregateOutputType | null
    _min: AmenityMinAggregateOutputType | null
    _max: AmenityMaxAggregateOutputType | null
  }

  export type AmenityMinAggregateOutputType = {
    id: string | null
    name: string | null
    icon: string | null
  }

  export type AmenityMaxAggregateOutputType = {
    id: string | null
    name: string | null
    icon: string | null
  }

  export type AmenityCountAggregateOutputType = {
    id: number
    name: number
    icon: number
    _all: number
  }


  export type AmenityMinAggregateInputType = {
    id?: true
    name?: true
    icon?: true
  }

  export type AmenityMaxAggregateInputType = {
    id?: true
    name?: true
    icon?: true
  }

  export type AmenityCountAggregateInputType = {
    id?: true
    name?: true
    icon?: true
    _all?: true
  }

  export type AmenityAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Amenity to aggregate.
     */
    where?: AmenityWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Amenities to fetch.
     */
    orderBy?: AmenityOrderByWithRelationInput | AmenityOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AmenityWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Amenities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Amenities.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Amenities
    **/
    _count?: true | AmenityCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AmenityMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AmenityMaxAggregateInputType
  }

  export type GetAmenityAggregateType<T extends AmenityAggregateArgs> = {
        [P in keyof T & keyof AggregateAmenity]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAmenity[P]>
      : GetScalarType<T[P], AggregateAmenity[P]>
  }




  export type AmenityGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AmenityWhereInput
    orderBy?: AmenityOrderByWithAggregationInput | AmenityOrderByWithAggregationInput[]
    by: AmenityScalarFieldEnum[] | AmenityScalarFieldEnum
    having?: AmenityScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AmenityCountAggregateInputType | true
    _min?: AmenityMinAggregateInputType
    _max?: AmenityMaxAggregateInputType
  }

  export type AmenityGroupByOutputType = {
    id: string
    name: string
    icon: string | null
    _count: AmenityCountAggregateOutputType | null
    _min: AmenityMinAggregateOutputType | null
    _max: AmenityMaxAggregateOutputType | null
  }

  type GetAmenityGroupByPayload<T extends AmenityGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AmenityGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AmenityGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AmenityGroupByOutputType[P]>
            : GetScalarType<T[P], AmenityGroupByOutputType[P]>
        }
      >
    >


  export type AmenitySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    icon?: boolean
    spaces?: boolean | Amenity$spacesArgs<ExtArgs>
    _count?: boolean | AmenityCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["amenity"]>

  export type AmenitySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    icon?: boolean
  }, ExtArgs["result"]["amenity"]>

  export type AmenitySelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    icon?: boolean
  }, ExtArgs["result"]["amenity"]>

  export type AmenitySelectScalar = {
    id?: boolean
    name?: boolean
    icon?: boolean
  }

  export type AmenityOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "icon", ExtArgs["result"]["amenity"]>
  export type AmenityInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    spaces?: boolean | Amenity$spacesArgs<ExtArgs>
    _count?: boolean | AmenityCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type AmenityIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type AmenityIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $AmenityPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Amenity"
    objects: {
      spaces: Prisma.$SpaceAmenityPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      icon: string | null
    }, ExtArgs["result"]["amenity"]>
    composites: {}
  }

  type AmenityGetPayload<S extends boolean | null | undefined | AmenityDefaultArgs> = $Result.GetResult<Prisma.$AmenityPayload, S>

  type AmenityCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AmenityFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AmenityCountAggregateInputType | true
    }

  export interface AmenityDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Amenity'], meta: { name: 'Amenity' } }
    /**
     * Find zero or one Amenity that matches the filter.
     * @param {AmenityFindUniqueArgs} args - Arguments to find a Amenity
     * @example
     * // Get one Amenity
     * const amenity = await prisma.amenity.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AmenityFindUniqueArgs>(args: SelectSubset<T, AmenityFindUniqueArgs<ExtArgs>>): Prisma__AmenityClient<$Result.GetResult<Prisma.$AmenityPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Amenity that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AmenityFindUniqueOrThrowArgs} args - Arguments to find a Amenity
     * @example
     * // Get one Amenity
     * const amenity = await prisma.amenity.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AmenityFindUniqueOrThrowArgs>(args: SelectSubset<T, AmenityFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AmenityClient<$Result.GetResult<Prisma.$AmenityPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Amenity that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AmenityFindFirstArgs} args - Arguments to find a Amenity
     * @example
     * // Get one Amenity
     * const amenity = await prisma.amenity.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AmenityFindFirstArgs>(args?: SelectSubset<T, AmenityFindFirstArgs<ExtArgs>>): Prisma__AmenityClient<$Result.GetResult<Prisma.$AmenityPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Amenity that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AmenityFindFirstOrThrowArgs} args - Arguments to find a Amenity
     * @example
     * // Get one Amenity
     * const amenity = await prisma.amenity.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AmenityFindFirstOrThrowArgs>(args?: SelectSubset<T, AmenityFindFirstOrThrowArgs<ExtArgs>>): Prisma__AmenityClient<$Result.GetResult<Prisma.$AmenityPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Amenities that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AmenityFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Amenities
     * const amenities = await prisma.amenity.findMany()
     * 
     * // Get first 10 Amenities
     * const amenities = await prisma.amenity.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const amenityWithIdOnly = await prisma.amenity.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AmenityFindManyArgs>(args?: SelectSubset<T, AmenityFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AmenityPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Amenity.
     * @param {AmenityCreateArgs} args - Arguments to create a Amenity.
     * @example
     * // Create one Amenity
     * const Amenity = await prisma.amenity.create({
     *   data: {
     *     // ... data to create a Amenity
     *   }
     * })
     * 
     */
    create<T extends AmenityCreateArgs>(args: SelectSubset<T, AmenityCreateArgs<ExtArgs>>): Prisma__AmenityClient<$Result.GetResult<Prisma.$AmenityPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Amenities.
     * @param {AmenityCreateManyArgs} args - Arguments to create many Amenities.
     * @example
     * // Create many Amenities
     * const amenity = await prisma.amenity.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AmenityCreateManyArgs>(args?: SelectSubset<T, AmenityCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Amenities and returns the data saved in the database.
     * @param {AmenityCreateManyAndReturnArgs} args - Arguments to create many Amenities.
     * @example
     * // Create many Amenities
     * const amenity = await prisma.amenity.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Amenities and only return the `id`
     * const amenityWithIdOnly = await prisma.amenity.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AmenityCreateManyAndReturnArgs>(args?: SelectSubset<T, AmenityCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AmenityPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Amenity.
     * @param {AmenityDeleteArgs} args - Arguments to delete one Amenity.
     * @example
     * // Delete one Amenity
     * const Amenity = await prisma.amenity.delete({
     *   where: {
     *     // ... filter to delete one Amenity
     *   }
     * })
     * 
     */
    delete<T extends AmenityDeleteArgs>(args: SelectSubset<T, AmenityDeleteArgs<ExtArgs>>): Prisma__AmenityClient<$Result.GetResult<Prisma.$AmenityPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Amenity.
     * @param {AmenityUpdateArgs} args - Arguments to update one Amenity.
     * @example
     * // Update one Amenity
     * const amenity = await prisma.amenity.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AmenityUpdateArgs>(args: SelectSubset<T, AmenityUpdateArgs<ExtArgs>>): Prisma__AmenityClient<$Result.GetResult<Prisma.$AmenityPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Amenities.
     * @param {AmenityDeleteManyArgs} args - Arguments to filter Amenities to delete.
     * @example
     * // Delete a few Amenities
     * const { count } = await prisma.amenity.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AmenityDeleteManyArgs>(args?: SelectSubset<T, AmenityDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Amenities.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AmenityUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Amenities
     * const amenity = await prisma.amenity.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AmenityUpdateManyArgs>(args: SelectSubset<T, AmenityUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Amenities and returns the data updated in the database.
     * @param {AmenityUpdateManyAndReturnArgs} args - Arguments to update many Amenities.
     * @example
     * // Update many Amenities
     * const amenity = await prisma.amenity.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Amenities and only return the `id`
     * const amenityWithIdOnly = await prisma.amenity.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AmenityUpdateManyAndReturnArgs>(args: SelectSubset<T, AmenityUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AmenityPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Amenity.
     * @param {AmenityUpsertArgs} args - Arguments to update or create a Amenity.
     * @example
     * // Update or create a Amenity
     * const amenity = await prisma.amenity.upsert({
     *   create: {
     *     // ... data to create a Amenity
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Amenity we want to update
     *   }
     * })
     */
    upsert<T extends AmenityUpsertArgs>(args: SelectSubset<T, AmenityUpsertArgs<ExtArgs>>): Prisma__AmenityClient<$Result.GetResult<Prisma.$AmenityPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Amenities.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AmenityCountArgs} args - Arguments to filter Amenities to count.
     * @example
     * // Count the number of Amenities
     * const count = await prisma.amenity.count({
     *   where: {
     *     // ... the filter for the Amenities we want to count
     *   }
     * })
    **/
    count<T extends AmenityCountArgs>(
      args?: Subset<T, AmenityCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AmenityCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Amenity.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AmenityAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AmenityAggregateArgs>(args: Subset<T, AmenityAggregateArgs>): Prisma.PrismaPromise<GetAmenityAggregateType<T>>

    /**
     * Group by Amenity.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AmenityGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AmenityGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AmenityGroupByArgs['orderBy'] }
        : { orderBy?: AmenityGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AmenityGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAmenityGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Amenity model
   */
  readonly fields: AmenityFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Amenity.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AmenityClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    spaces<T extends Amenity$spacesArgs<ExtArgs> = {}>(args?: Subset<T, Amenity$spacesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SpaceAmenityPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Amenity model
   */
  interface AmenityFieldRefs {
    readonly id: FieldRef<"Amenity", 'String'>
    readonly name: FieldRef<"Amenity", 'String'>
    readonly icon: FieldRef<"Amenity", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Amenity findUnique
   */
  export type AmenityFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Amenity
     */
    select?: AmenitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Amenity
     */
    omit?: AmenityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AmenityInclude<ExtArgs> | null
    /**
     * Filter, which Amenity to fetch.
     */
    where: AmenityWhereUniqueInput
  }

  /**
   * Amenity findUniqueOrThrow
   */
  export type AmenityFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Amenity
     */
    select?: AmenitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Amenity
     */
    omit?: AmenityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AmenityInclude<ExtArgs> | null
    /**
     * Filter, which Amenity to fetch.
     */
    where: AmenityWhereUniqueInput
  }

  /**
   * Amenity findFirst
   */
  export type AmenityFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Amenity
     */
    select?: AmenitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Amenity
     */
    omit?: AmenityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AmenityInclude<ExtArgs> | null
    /**
     * Filter, which Amenity to fetch.
     */
    where?: AmenityWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Amenities to fetch.
     */
    orderBy?: AmenityOrderByWithRelationInput | AmenityOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Amenities.
     */
    cursor?: AmenityWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Amenities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Amenities.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Amenities.
     */
    distinct?: AmenityScalarFieldEnum | AmenityScalarFieldEnum[]
  }

  /**
   * Amenity findFirstOrThrow
   */
  export type AmenityFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Amenity
     */
    select?: AmenitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Amenity
     */
    omit?: AmenityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AmenityInclude<ExtArgs> | null
    /**
     * Filter, which Amenity to fetch.
     */
    where?: AmenityWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Amenities to fetch.
     */
    orderBy?: AmenityOrderByWithRelationInput | AmenityOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Amenities.
     */
    cursor?: AmenityWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Amenities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Amenities.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Amenities.
     */
    distinct?: AmenityScalarFieldEnum | AmenityScalarFieldEnum[]
  }

  /**
   * Amenity findMany
   */
  export type AmenityFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Amenity
     */
    select?: AmenitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Amenity
     */
    omit?: AmenityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AmenityInclude<ExtArgs> | null
    /**
     * Filter, which Amenities to fetch.
     */
    where?: AmenityWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Amenities to fetch.
     */
    orderBy?: AmenityOrderByWithRelationInput | AmenityOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Amenities.
     */
    cursor?: AmenityWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Amenities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Amenities.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Amenities.
     */
    distinct?: AmenityScalarFieldEnum | AmenityScalarFieldEnum[]
  }

  /**
   * Amenity create
   */
  export type AmenityCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Amenity
     */
    select?: AmenitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Amenity
     */
    omit?: AmenityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AmenityInclude<ExtArgs> | null
    /**
     * The data needed to create a Amenity.
     */
    data: XOR<AmenityCreateInput, AmenityUncheckedCreateInput>
  }

  /**
   * Amenity createMany
   */
  export type AmenityCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Amenities.
     */
    data: AmenityCreateManyInput | AmenityCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Amenity createManyAndReturn
   */
  export type AmenityCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Amenity
     */
    select?: AmenitySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Amenity
     */
    omit?: AmenityOmit<ExtArgs> | null
    /**
     * The data used to create many Amenities.
     */
    data: AmenityCreateManyInput | AmenityCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Amenity update
   */
  export type AmenityUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Amenity
     */
    select?: AmenitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Amenity
     */
    omit?: AmenityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AmenityInclude<ExtArgs> | null
    /**
     * The data needed to update a Amenity.
     */
    data: XOR<AmenityUpdateInput, AmenityUncheckedUpdateInput>
    /**
     * Choose, which Amenity to update.
     */
    where: AmenityWhereUniqueInput
  }

  /**
   * Amenity updateMany
   */
  export type AmenityUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Amenities.
     */
    data: XOR<AmenityUpdateManyMutationInput, AmenityUncheckedUpdateManyInput>
    /**
     * Filter which Amenities to update
     */
    where?: AmenityWhereInput
    /**
     * Limit how many Amenities to update.
     */
    limit?: number
  }

  /**
   * Amenity updateManyAndReturn
   */
  export type AmenityUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Amenity
     */
    select?: AmenitySelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Amenity
     */
    omit?: AmenityOmit<ExtArgs> | null
    /**
     * The data used to update Amenities.
     */
    data: XOR<AmenityUpdateManyMutationInput, AmenityUncheckedUpdateManyInput>
    /**
     * Filter which Amenities to update
     */
    where?: AmenityWhereInput
    /**
     * Limit how many Amenities to update.
     */
    limit?: number
  }

  /**
   * Amenity upsert
   */
  export type AmenityUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Amenity
     */
    select?: AmenitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Amenity
     */
    omit?: AmenityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AmenityInclude<ExtArgs> | null
    /**
     * The filter to search for the Amenity to update in case it exists.
     */
    where: AmenityWhereUniqueInput
    /**
     * In case the Amenity found by the `where` argument doesn't exist, create a new Amenity with this data.
     */
    create: XOR<AmenityCreateInput, AmenityUncheckedCreateInput>
    /**
     * In case the Amenity was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AmenityUpdateInput, AmenityUncheckedUpdateInput>
  }

  /**
   * Amenity delete
   */
  export type AmenityDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Amenity
     */
    select?: AmenitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Amenity
     */
    omit?: AmenityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AmenityInclude<ExtArgs> | null
    /**
     * Filter which Amenity to delete.
     */
    where: AmenityWhereUniqueInput
  }

  /**
   * Amenity deleteMany
   */
  export type AmenityDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Amenities to delete
     */
    where?: AmenityWhereInput
    /**
     * Limit how many Amenities to delete.
     */
    limit?: number
  }

  /**
   * Amenity.spaces
   */
  export type Amenity$spacesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SpaceAmenity
     */
    select?: SpaceAmenitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the SpaceAmenity
     */
    omit?: SpaceAmenityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SpaceAmenityInclude<ExtArgs> | null
    where?: SpaceAmenityWhereInput
    orderBy?: SpaceAmenityOrderByWithRelationInput | SpaceAmenityOrderByWithRelationInput[]
    cursor?: SpaceAmenityWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SpaceAmenityScalarFieldEnum | SpaceAmenityScalarFieldEnum[]
  }

  /**
   * Amenity without action
   */
  export type AmenityDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Amenity
     */
    select?: AmenitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Amenity
     */
    omit?: AmenityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AmenityInclude<ExtArgs> | null
  }


  /**
   * Model Space
   */

  export type AggregateSpace = {
    _count: SpaceCountAggregateOutputType | null
    _avg: SpaceAvgAggregateOutputType | null
    _sum: SpaceSumAggregateOutputType | null
    _min: SpaceMinAggregateOutputType | null
    _max: SpaceMaxAggregateOutputType | null
  }

  export type SpaceAvgAggregateOutputType = {
    capacity: number | null
    price: number | null
  }

  export type SpaceSumAggregateOutputType = {
    capacity: number | null
    price: number | null
  }

  export type SpaceMinAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
    city: string | null
    district: string | null
    address: string | null
    capacity: number | null
    price: number | null
    pricePeriod: string | null
    status: $Enums.SpaceStatus | null
    adminNotes: string | null
    createdAt: Date | null
    updatedAt: Date | null
    typeId: string | null
    sellerId: string | null
  }

  export type SpaceMaxAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
    city: string | null
    district: string | null
    address: string | null
    capacity: number | null
    price: number | null
    pricePeriod: string | null
    status: $Enums.SpaceStatus | null
    adminNotes: string | null
    createdAt: Date | null
    updatedAt: Date | null
    typeId: string | null
    sellerId: string | null
  }

  export type SpaceCountAggregateOutputType = {
    id: number
    name: number
    description: number
    city: number
    district: number
    address: number
    capacity: number
    price: number
    pricePeriod: number
    status: number
    adminNotes: number
    createdAt: number
    updatedAt: number
    typeId: number
    sellerId: number
    _all: number
  }


  export type SpaceAvgAggregateInputType = {
    capacity?: true
    price?: true
  }

  export type SpaceSumAggregateInputType = {
    capacity?: true
    price?: true
  }

  export type SpaceMinAggregateInputType = {
    id?: true
    name?: true
    description?: true
    city?: true
    district?: true
    address?: true
    capacity?: true
    price?: true
    pricePeriod?: true
    status?: true
    adminNotes?: true
    createdAt?: true
    updatedAt?: true
    typeId?: true
    sellerId?: true
  }

  export type SpaceMaxAggregateInputType = {
    id?: true
    name?: true
    description?: true
    city?: true
    district?: true
    address?: true
    capacity?: true
    price?: true
    pricePeriod?: true
    status?: true
    adminNotes?: true
    createdAt?: true
    updatedAt?: true
    typeId?: true
    sellerId?: true
  }

  export type SpaceCountAggregateInputType = {
    id?: true
    name?: true
    description?: true
    city?: true
    district?: true
    address?: true
    capacity?: true
    price?: true
    pricePeriod?: true
    status?: true
    adminNotes?: true
    createdAt?: true
    updatedAt?: true
    typeId?: true
    sellerId?: true
    _all?: true
  }

  export type SpaceAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Space to aggregate.
     */
    where?: SpaceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Spaces to fetch.
     */
    orderBy?: SpaceOrderByWithRelationInput | SpaceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SpaceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Spaces from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Spaces.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Spaces
    **/
    _count?: true | SpaceCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: SpaceAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: SpaceSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SpaceMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SpaceMaxAggregateInputType
  }

  export type GetSpaceAggregateType<T extends SpaceAggregateArgs> = {
        [P in keyof T & keyof AggregateSpace]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSpace[P]>
      : GetScalarType<T[P], AggregateSpace[P]>
  }




  export type SpaceGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SpaceWhereInput
    orderBy?: SpaceOrderByWithAggregationInput | SpaceOrderByWithAggregationInput[]
    by: SpaceScalarFieldEnum[] | SpaceScalarFieldEnum
    having?: SpaceScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SpaceCountAggregateInputType | true
    _avg?: SpaceAvgAggregateInputType
    _sum?: SpaceSumAggregateInputType
    _min?: SpaceMinAggregateInputType
    _max?: SpaceMaxAggregateInputType
  }

  export type SpaceGroupByOutputType = {
    id: string
    name: string
    description: string | null
    city: string
    district: string | null
    address: string | null
    capacity: number | null
    price: number
    pricePeriod: string
    status: $Enums.SpaceStatus
    adminNotes: string | null
    createdAt: Date
    updatedAt: Date
    typeId: string
    sellerId: string
    _count: SpaceCountAggregateOutputType | null
    _avg: SpaceAvgAggregateOutputType | null
    _sum: SpaceSumAggregateOutputType | null
    _min: SpaceMinAggregateOutputType | null
    _max: SpaceMaxAggregateOutputType | null
  }

  type GetSpaceGroupByPayload<T extends SpaceGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SpaceGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SpaceGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SpaceGroupByOutputType[P]>
            : GetScalarType<T[P], SpaceGroupByOutputType[P]>
        }
      >
    >


  export type SpaceSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    city?: boolean
    district?: boolean
    address?: boolean
    capacity?: boolean
    price?: boolean
    pricePeriod?: boolean
    status?: boolean
    adminNotes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    typeId?: boolean
    sellerId?: boolean
    type?: boolean | SpaceTypeDefaultArgs<ExtArgs>
    seller?: boolean | UserDefaultArgs<ExtArgs>
    images?: boolean | Space$imagesArgs<ExtArgs>
    amenities?: boolean | Space$amenitiesArgs<ExtArgs>
    bookings?: boolean | Space$bookingsArgs<ExtArgs>
    _count?: boolean | SpaceCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["space"]>

  export type SpaceSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    city?: boolean
    district?: boolean
    address?: boolean
    capacity?: boolean
    price?: boolean
    pricePeriod?: boolean
    status?: boolean
    adminNotes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    typeId?: boolean
    sellerId?: boolean
    type?: boolean | SpaceTypeDefaultArgs<ExtArgs>
    seller?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["space"]>

  export type SpaceSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    city?: boolean
    district?: boolean
    address?: boolean
    capacity?: boolean
    price?: boolean
    pricePeriod?: boolean
    status?: boolean
    adminNotes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    typeId?: boolean
    sellerId?: boolean
    type?: boolean | SpaceTypeDefaultArgs<ExtArgs>
    seller?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["space"]>

  export type SpaceSelectScalar = {
    id?: boolean
    name?: boolean
    description?: boolean
    city?: boolean
    district?: boolean
    address?: boolean
    capacity?: boolean
    price?: boolean
    pricePeriod?: boolean
    status?: boolean
    adminNotes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    typeId?: boolean
    sellerId?: boolean
  }

  export type SpaceOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "description" | "city" | "district" | "address" | "capacity" | "price" | "pricePeriod" | "status" | "adminNotes" | "createdAt" | "updatedAt" | "typeId" | "sellerId", ExtArgs["result"]["space"]>
  export type SpaceInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    type?: boolean | SpaceTypeDefaultArgs<ExtArgs>
    seller?: boolean | UserDefaultArgs<ExtArgs>
    images?: boolean | Space$imagesArgs<ExtArgs>
    amenities?: boolean | Space$amenitiesArgs<ExtArgs>
    bookings?: boolean | Space$bookingsArgs<ExtArgs>
    _count?: boolean | SpaceCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type SpaceIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    type?: boolean | SpaceTypeDefaultArgs<ExtArgs>
    seller?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type SpaceIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    type?: boolean | SpaceTypeDefaultArgs<ExtArgs>
    seller?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $SpacePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Space"
    objects: {
      type: Prisma.$SpaceTypePayload<ExtArgs>
      seller: Prisma.$UserPayload<ExtArgs>
      images: Prisma.$SpaceImagePayload<ExtArgs>[]
      amenities: Prisma.$SpaceAmenityPayload<ExtArgs>[]
      bookings: Prisma.$BookingPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      description: string | null
      city: string
      district: string | null
      address: string | null
      capacity: number | null
      price: number
      pricePeriod: string
      status: $Enums.SpaceStatus
      adminNotes: string | null
      createdAt: Date
      updatedAt: Date
      typeId: string
      sellerId: string
    }, ExtArgs["result"]["space"]>
    composites: {}
  }

  type SpaceGetPayload<S extends boolean | null | undefined | SpaceDefaultArgs> = $Result.GetResult<Prisma.$SpacePayload, S>

  type SpaceCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SpaceFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SpaceCountAggregateInputType | true
    }

  export interface SpaceDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Space'], meta: { name: 'Space' } }
    /**
     * Find zero or one Space that matches the filter.
     * @param {SpaceFindUniqueArgs} args - Arguments to find a Space
     * @example
     * // Get one Space
     * const space = await prisma.space.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SpaceFindUniqueArgs>(args: SelectSubset<T, SpaceFindUniqueArgs<ExtArgs>>): Prisma__SpaceClient<$Result.GetResult<Prisma.$SpacePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Space that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SpaceFindUniqueOrThrowArgs} args - Arguments to find a Space
     * @example
     * // Get one Space
     * const space = await prisma.space.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SpaceFindUniqueOrThrowArgs>(args: SelectSubset<T, SpaceFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SpaceClient<$Result.GetResult<Prisma.$SpacePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Space that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SpaceFindFirstArgs} args - Arguments to find a Space
     * @example
     * // Get one Space
     * const space = await prisma.space.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SpaceFindFirstArgs>(args?: SelectSubset<T, SpaceFindFirstArgs<ExtArgs>>): Prisma__SpaceClient<$Result.GetResult<Prisma.$SpacePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Space that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SpaceFindFirstOrThrowArgs} args - Arguments to find a Space
     * @example
     * // Get one Space
     * const space = await prisma.space.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SpaceFindFirstOrThrowArgs>(args?: SelectSubset<T, SpaceFindFirstOrThrowArgs<ExtArgs>>): Prisma__SpaceClient<$Result.GetResult<Prisma.$SpacePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Spaces that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SpaceFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Spaces
     * const spaces = await prisma.space.findMany()
     * 
     * // Get first 10 Spaces
     * const spaces = await prisma.space.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const spaceWithIdOnly = await prisma.space.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SpaceFindManyArgs>(args?: SelectSubset<T, SpaceFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SpacePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Space.
     * @param {SpaceCreateArgs} args - Arguments to create a Space.
     * @example
     * // Create one Space
     * const Space = await prisma.space.create({
     *   data: {
     *     // ... data to create a Space
     *   }
     * })
     * 
     */
    create<T extends SpaceCreateArgs>(args: SelectSubset<T, SpaceCreateArgs<ExtArgs>>): Prisma__SpaceClient<$Result.GetResult<Prisma.$SpacePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Spaces.
     * @param {SpaceCreateManyArgs} args - Arguments to create many Spaces.
     * @example
     * // Create many Spaces
     * const space = await prisma.space.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SpaceCreateManyArgs>(args?: SelectSubset<T, SpaceCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Spaces and returns the data saved in the database.
     * @param {SpaceCreateManyAndReturnArgs} args - Arguments to create many Spaces.
     * @example
     * // Create many Spaces
     * const space = await prisma.space.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Spaces and only return the `id`
     * const spaceWithIdOnly = await prisma.space.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SpaceCreateManyAndReturnArgs>(args?: SelectSubset<T, SpaceCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SpacePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Space.
     * @param {SpaceDeleteArgs} args - Arguments to delete one Space.
     * @example
     * // Delete one Space
     * const Space = await prisma.space.delete({
     *   where: {
     *     // ... filter to delete one Space
     *   }
     * })
     * 
     */
    delete<T extends SpaceDeleteArgs>(args: SelectSubset<T, SpaceDeleteArgs<ExtArgs>>): Prisma__SpaceClient<$Result.GetResult<Prisma.$SpacePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Space.
     * @param {SpaceUpdateArgs} args - Arguments to update one Space.
     * @example
     * // Update one Space
     * const space = await prisma.space.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SpaceUpdateArgs>(args: SelectSubset<T, SpaceUpdateArgs<ExtArgs>>): Prisma__SpaceClient<$Result.GetResult<Prisma.$SpacePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Spaces.
     * @param {SpaceDeleteManyArgs} args - Arguments to filter Spaces to delete.
     * @example
     * // Delete a few Spaces
     * const { count } = await prisma.space.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SpaceDeleteManyArgs>(args?: SelectSubset<T, SpaceDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Spaces.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SpaceUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Spaces
     * const space = await prisma.space.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SpaceUpdateManyArgs>(args: SelectSubset<T, SpaceUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Spaces and returns the data updated in the database.
     * @param {SpaceUpdateManyAndReturnArgs} args - Arguments to update many Spaces.
     * @example
     * // Update many Spaces
     * const space = await prisma.space.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Spaces and only return the `id`
     * const spaceWithIdOnly = await prisma.space.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends SpaceUpdateManyAndReturnArgs>(args: SelectSubset<T, SpaceUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SpacePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Space.
     * @param {SpaceUpsertArgs} args - Arguments to update or create a Space.
     * @example
     * // Update or create a Space
     * const space = await prisma.space.upsert({
     *   create: {
     *     // ... data to create a Space
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Space we want to update
     *   }
     * })
     */
    upsert<T extends SpaceUpsertArgs>(args: SelectSubset<T, SpaceUpsertArgs<ExtArgs>>): Prisma__SpaceClient<$Result.GetResult<Prisma.$SpacePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Spaces.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SpaceCountArgs} args - Arguments to filter Spaces to count.
     * @example
     * // Count the number of Spaces
     * const count = await prisma.space.count({
     *   where: {
     *     // ... the filter for the Spaces we want to count
     *   }
     * })
    **/
    count<T extends SpaceCountArgs>(
      args?: Subset<T, SpaceCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SpaceCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Space.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SpaceAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SpaceAggregateArgs>(args: Subset<T, SpaceAggregateArgs>): Prisma.PrismaPromise<GetSpaceAggregateType<T>>

    /**
     * Group by Space.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SpaceGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SpaceGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SpaceGroupByArgs['orderBy'] }
        : { orderBy?: SpaceGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SpaceGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSpaceGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Space model
   */
  readonly fields: SpaceFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Space.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SpaceClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    type<T extends SpaceTypeDefaultArgs<ExtArgs> = {}>(args?: Subset<T, SpaceTypeDefaultArgs<ExtArgs>>): Prisma__SpaceTypeClient<$Result.GetResult<Prisma.$SpaceTypePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    seller<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    images<T extends Space$imagesArgs<ExtArgs> = {}>(args?: Subset<T, Space$imagesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SpaceImagePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    amenities<T extends Space$amenitiesArgs<ExtArgs> = {}>(args?: Subset<T, Space$amenitiesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SpaceAmenityPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    bookings<T extends Space$bookingsArgs<ExtArgs> = {}>(args?: Subset<T, Space$bookingsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BookingPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Space model
   */
  interface SpaceFieldRefs {
    readonly id: FieldRef<"Space", 'String'>
    readonly name: FieldRef<"Space", 'String'>
    readonly description: FieldRef<"Space", 'String'>
    readonly city: FieldRef<"Space", 'String'>
    readonly district: FieldRef<"Space", 'String'>
    readonly address: FieldRef<"Space", 'String'>
    readonly capacity: FieldRef<"Space", 'Int'>
    readonly price: FieldRef<"Space", 'Float'>
    readonly pricePeriod: FieldRef<"Space", 'String'>
    readonly status: FieldRef<"Space", 'SpaceStatus'>
    readonly adminNotes: FieldRef<"Space", 'String'>
    readonly createdAt: FieldRef<"Space", 'DateTime'>
    readonly updatedAt: FieldRef<"Space", 'DateTime'>
    readonly typeId: FieldRef<"Space", 'String'>
    readonly sellerId: FieldRef<"Space", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Space findUnique
   */
  export type SpaceFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Space
     */
    select?: SpaceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Space
     */
    omit?: SpaceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SpaceInclude<ExtArgs> | null
    /**
     * Filter, which Space to fetch.
     */
    where: SpaceWhereUniqueInput
  }

  /**
   * Space findUniqueOrThrow
   */
  export type SpaceFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Space
     */
    select?: SpaceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Space
     */
    omit?: SpaceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SpaceInclude<ExtArgs> | null
    /**
     * Filter, which Space to fetch.
     */
    where: SpaceWhereUniqueInput
  }

  /**
   * Space findFirst
   */
  export type SpaceFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Space
     */
    select?: SpaceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Space
     */
    omit?: SpaceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SpaceInclude<ExtArgs> | null
    /**
     * Filter, which Space to fetch.
     */
    where?: SpaceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Spaces to fetch.
     */
    orderBy?: SpaceOrderByWithRelationInput | SpaceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Spaces.
     */
    cursor?: SpaceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Spaces from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Spaces.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Spaces.
     */
    distinct?: SpaceScalarFieldEnum | SpaceScalarFieldEnum[]
  }

  /**
   * Space findFirstOrThrow
   */
  export type SpaceFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Space
     */
    select?: SpaceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Space
     */
    omit?: SpaceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SpaceInclude<ExtArgs> | null
    /**
     * Filter, which Space to fetch.
     */
    where?: SpaceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Spaces to fetch.
     */
    orderBy?: SpaceOrderByWithRelationInput | SpaceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Spaces.
     */
    cursor?: SpaceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Spaces from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Spaces.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Spaces.
     */
    distinct?: SpaceScalarFieldEnum | SpaceScalarFieldEnum[]
  }

  /**
   * Space findMany
   */
  export type SpaceFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Space
     */
    select?: SpaceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Space
     */
    omit?: SpaceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SpaceInclude<ExtArgs> | null
    /**
     * Filter, which Spaces to fetch.
     */
    where?: SpaceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Spaces to fetch.
     */
    orderBy?: SpaceOrderByWithRelationInput | SpaceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Spaces.
     */
    cursor?: SpaceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Spaces from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Spaces.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Spaces.
     */
    distinct?: SpaceScalarFieldEnum | SpaceScalarFieldEnum[]
  }

  /**
   * Space create
   */
  export type SpaceCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Space
     */
    select?: SpaceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Space
     */
    omit?: SpaceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SpaceInclude<ExtArgs> | null
    /**
     * The data needed to create a Space.
     */
    data: XOR<SpaceCreateInput, SpaceUncheckedCreateInput>
  }

  /**
   * Space createMany
   */
  export type SpaceCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Spaces.
     */
    data: SpaceCreateManyInput | SpaceCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Space createManyAndReturn
   */
  export type SpaceCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Space
     */
    select?: SpaceSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Space
     */
    omit?: SpaceOmit<ExtArgs> | null
    /**
     * The data used to create many Spaces.
     */
    data: SpaceCreateManyInput | SpaceCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SpaceIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Space update
   */
  export type SpaceUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Space
     */
    select?: SpaceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Space
     */
    omit?: SpaceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SpaceInclude<ExtArgs> | null
    /**
     * The data needed to update a Space.
     */
    data: XOR<SpaceUpdateInput, SpaceUncheckedUpdateInput>
    /**
     * Choose, which Space to update.
     */
    where: SpaceWhereUniqueInput
  }

  /**
   * Space updateMany
   */
  export type SpaceUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Spaces.
     */
    data: XOR<SpaceUpdateManyMutationInput, SpaceUncheckedUpdateManyInput>
    /**
     * Filter which Spaces to update
     */
    where?: SpaceWhereInput
    /**
     * Limit how many Spaces to update.
     */
    limit?: number
  }

  /**
   * Space updateManyAndReturn
   */
  export type SpaceUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Space
     */
    select?: SpaceSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Space
     */
    omit?: SpaceOmit<ExtArgs> | null
    /**
     * The data used to update Spaces.
     */
    data: XOR<SpaceUpdateManyMutationInput, SpaceUncheckedUpdateManyInput>
    /**
     * Filter which Spaces to update
     */
    where?: SpaceWhereInput
    /**
     * Limit how many Spaces to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SpaceIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Space upsert
   */
  export type SpaceUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Space
     */
    select?: SpaceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Space
     */
    omit?: SpaceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SpaceInclude<ExtArgs> | null
    /**
     * The filter to search for the Space to update in case it exists.
     */
    where: SpaceWhereUniqueInput
    /**
     * In case the Space found by the `where` argument doesn't exist, create a new Space with this data.
     */
    create: XOR<SpaceCreateInput, SpaceUncheckedCreateInput>
    /**
     * In case the Space was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SpaceUpdateInput, SpaceUncheckedUpdateInput>
  }

  /**
   * Space delete
   */
  export type SpaceDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Space
     */
    select?: SpaceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Space
     */
    omit?: SpaceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SpaceInclude<ExtArgs> | null
    /**
     * Filter which Space to delete.
     */
    where: SpaceWhereUniqueInput
  }

  /**
   * Space deleteMany
   */
  export type SpaceDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Spaces to delete
     */
    where?: SpaceWhereInput
    /**
     * Limit how many Spaces to delete.
     */
    limit?: number
  }

  /**
   * Space.images
   */
  export type Space$imagesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SpaceImage
     */
    select?: SpaceImageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SpaceImage
     */
    omit?: SpaceImageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SpaceImageInclude<ExtArgs> | null
    where?: SpaceImageWhereInput
    orderBy?: SpaceImageOrderByWithRelationInput | SpaceImageOrderByWithRelationInput[]
    cursor?: SpaceImageWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SpaceImageScalarFieldEnum | SpaceImageScalarFieldEnum[]
  }

  /**
   * Space.amenities
   */
  export type Space$amenitiesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SpaceAmenity
     */
    select?: SpaceAmenitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the SpaceAmenity
     */
    omit?: SpaceAmenityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SpaceAmenityInclude<ExtArgs> | null
    where?: SpaceAmenityWhereInput
    orderBy?: SpaceAmenityOrderByWithRelationInput | SpaceAmenityOrderByWithRelationInput[]
    cursor?: SpaceAmenityWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SpaceAmenityScalarFieldEnum | SpaceAmenityScalarFieldEnum[]
  }

  /**
   * Space.bookings
   */
  export type Space$bookingsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Booking
     */
    select?: BookingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Booking
     */
    omit?: BookingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingInclude<ExtArgs> | null
    where?: BookingWhereInput
    orderBy?: BookingOrderByWithRelationInput | BookingOrderByWithRelationInput[]
    cursor?: BookingWhereUniqueInput
    take?: number
    skip?: number
    distinct?: BookingScalarFieldEnum | BookingScalarFieldEnum[]
  }

  /**
   * Space without action
   */
  export type SpaceDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Space
     */
    select?: SpaceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Space
     */
    omit?: SpaceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SpaceInclude<ExtArgs> | null
  }


  /**
   * Model SpaceImage
   */

  export type AggregateSpaceImage = {
    _count: SpaceImageCountAggregateOutputType | null
    _avg: SpaceImageAvgAggregateOutputType | null
    _sum: SpaceImageSumAggregateOutputType | null
    _min: SpaceImageMinAggregateOutputType | null
    _max: SpaceImageMaxAggregateOutputType | null
  }

  export type SpaceImageAvgAggregateOutputType = {
    order: number | null
  }

  export type SpaceImageSumAggregateOutputType = {
    order: number | null
  }

  export type SpaceImageMinAggregateOutputType = {
    id: string | null
    url: string | null
    order: number | null
    spaceId: string | null
  }

  export type SpaceImageMaxAggregateOutputType = {
    id: string | null
    url: string | null
    order: number | null
    spaceId: string | null
  }

  export type SpaceImageCountAggregateOutputType = {
    id: number
    url: number
    order: number
    spaceId: number
    _all: number
  }


  export type SpaceImageAvgAggregateInputType = {
    order?: true
  }

  export type SpaceImageSumAggregateInputType = {
    order?: true
  }

  export type SpaceImageMinAggregateInputType = {
    id?: true
    url?: true
    order?: true
    spaceId?: true
  }

  export type SpaceImageMaxAggregateInputType = {
    id?: true
    url?: true
    order?: true
    spaceId?: true
  }

  export type SpaceImageCountAggregateInputType = {
    id?: true
    url?: true
    order?: true
    spaceId?: true
    _all?: true
  }

  export type SpaceImageAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SpaceImage to aggregate.
     */
    where?: SpaceImageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SpaceImages to fetch.
     */
    orderBy?: SpaceImageOrderByWithRelationInput | SpaceImageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SpaceImageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SpaceImages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SpaceImages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned SpaceImages
    **/
    _count?: true | SpaceImageCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: SpaceImageAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: SpaceImageSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SpaceImageMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SpaceImageMaxAggregateInputType
  }

  export type GetSpaceImageAggregateType<T extends SpaceImageAggregateArgs> = {
        [P in keyof T & keyof AggregateSpaceImage]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSpaceImage[P]>
      : GetScalarType<T[P], AggregateSpaceImage[P]>
  }




  export type SpaceImageGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SpaceImageWhereInput
    orderBy?: SpaceImageOrderByWithAggregationInput | SpaceImageOrderByWithAggregationInput[]
    by: SpaceImageScalarFieldEnum[] | SpaceImageScalarFieldEnum
    having?: SpaceImageScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SpaceImageCountAggregateInputType | true
    _avg?: SpaceImageAvgAggregateInputType
    _sum?: SpaceImageSumAggregateInputType
    _min?: SpaceImageMinAggregateInputType
    _max?: SpaceImageMaxAggregateInputType
  }

  export type SpaceImageGroupByOutputType = {
    id: string
    url: string
    order: number
    spaceId: string
    _count: SpaceImageCountAggregateOutputType | null
    _avg: SpaceImageAvgAggregateOutputType | null
    _sum: SpaceImageSumAggregateOutputType | null
    _min: SpaceImageMinAggregateOutputType | null
    _max: SpaceImageMaxAggregateOutputType | null
  }

  type GetSpaceImageGroupByPayload<T extends SpaceImageGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SpaceImageGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SpaceImageGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SpaceImageGroupByOutputType[P]>
            : GetScalarType<T[P], SpaceImageGroupByOutputType[P]>
        }
      >
    >


  export type SpaceImageSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    url?: boolean
    order?: boolean
    spaceId?: boolean
    space?: boolean | SpaceDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["spaceImage"]>

  export type SpaceImageSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    url?: boolean
    order?: boolean
    spaceId?: boolean
    space?: boolean | SpaceDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["spaceImage"]>

  export type SpaceImageSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    url?: boolean
    order?: boolean
    spaceId?: boolean
    space?: boolean | SpaceDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["spaceImage"]>

  export type SpaceImageSelectScalar = {
    id?: boolean
    url?: boolean
    order?: boolean
    spaceId?: boolean
  }

  export type SpaceImageOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "url" | "order" | "spaceId", ExtArgs["result"]["spaceImage"]>
  export type SpaceImageInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    space?: boolean | SpaceDefaultArgs<ExtArgs>
  }
  export type SpaceImageIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    space?: boolean | SpaceDefaultArgs<ExtArgs>
  }
  export type SpaceImageIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    space?: boolean | SpaceDefaultArgs<ExtArgs>
  }

  export type $SpaceImagePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "SpaceImage"
    objects: {
      space: Prisma.$SpacePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      url: string
      order: number
      spaceId: string
    }, ExtArgs["result"]["spaceImage"]>
    composites: {}
  }

  type SpaceImageGetPayload<S extends boolean | null | undefined | SpaceImageDefaultArgs> = $Result.GetResult<Prisma.$SpaceImagePayload, S>

  type SpaceImageCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SpaceImageFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SpaceImageCountAggregateInputType | true
    }

  export interface SpaceImageDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['SpaceImage'], meta: { name: 'SpaceImage' } }
    /**
     * Find zero or one SpaceImage that matches the filter.
     * @param {SpaceImageFindUniqueArgs} args - Arguments to find a SpaceImage
     * @example
     * // Get one SpaceImage
     * const spaceImage = await prisma.spaceImage.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SpaceImageFindUniqueArgs>(args: SelectSubset<T, SpaceImageFindUniqueArgs<ExtArgs>>): Prisma__SpaceImageClient<$Result.GetResult<Prisma.$SpaceImagePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one SpaceImage that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SpaceImageFindUniqueOrThrowArgs} args - Arguments to find a SpaceImage
     * @example
     * // Get one SpaceImage
     * const spaceImage = await prisma.spaceImage.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SpaceImageFindUniqueOrThrowArgs>(args: SelectSubset<T, SpaceImageFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SpaceImageClient<$Result.GetResult<Prisma.$SpaceImagePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SpaceImage that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SpaceImageFindFirstArgs} args - Arguments to find a SpaceImage
     * @example
     * // Get one SpaceImage
     * const spaceImage = await prisma.spaceImage.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SpaceImageFindFirstArgs>(args?: SelectSubset<T, SpaceImageFindFirstArgs<ExtArgs>>): Prisma__SpaceImageClient<$Result.GetResult<Prisma.$SpaceImagePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SpaceImage that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SpaceImageFindFirstOrThrowArgs} args - Arguments to find a SpaceImage
     * @example
     * // Get one SpaceImage
     * const spaceImage = await prisma.spaceImage.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SpaceImageFindFirstOrThrowArgs>(args?: SelectSubset<T, SpaceImageFindFirstOrThrowArgs<ExtArgs>>): Prisma__SpaceImageClient<$Result.GetResult<Prisma.$SpaceImagePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more SpaceImages that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SpaceImageFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all SpaceImages
     * const spaceImages = await prisma.spaceImage.findMany()
     * 
     * // Get first 10 SpaceImages
     * const spaceImages = await prisma.spaceImage.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const spaceImageWithIdOnly = await prisma.spaceImage.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SpaceImageFindManyArgs>(args?: SelectSubset<T, SpaceImageFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SpaceImagePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a SpaceImage.
     * @param {SpaceImageCreateArgs} args - Arguments to create a SpaceImage.
     * @example
     * // Create one SpaceImage
     * const SpaceImage = await prisma.spaceImage.create({
     *   data: {
     *     // ... data to create a SpaceImage
     *   }
     * })
     * 
     */
    create<T extends SpaceImageCreateArgs>(args: SelectSubset<T, SpaceImageCreateArgs<ExtArgs>>): Prisma__SpaceImageClient<$Result.GetResult<Prisma.$SpaceImagePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many SpaceImages.
     * @param {SpaceImageCreateManyArgs} args - Arguments to create many SpaceImages.
     * @example
     * // Create many SpaceImages
     * const spaceImage = await prisma.spaceImage.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SpaceImageCreateManyArgs>(args?: SelectSubset<T, SpaceImageCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many SpaceImages and returns the data saved in the database.
     * @param {SpaceImageCreateManyAndReturnArgs} args - Arguments to create many SpaceImages.
     * @example
     * // Create many SpaceImages
     * const spaceImage = await prisma.spaceImage.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many SpaceImages and only return the `id`
     * const spaceImageWithIdOnly = await prisma.spaceImage.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SpaceImageCreateManyAndReturnArgs>(args?: SelectSubset<T, SpaceImageCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SpaceImagePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a SpaceImage.
     * @param {SpaceImageDeleteArgs} args - Arguments to delete one SpaceImage.
     * @example
     * // Delete one SpaceImage
     * const SpaceImage = await prisma.spaceImage.delete({
     *   where: {
     *     // ... filter to delete one SpaceImage
     *   }
     * })
     * 
     */
    delete<T extends SpaceImageDeleteArgs>(args: SelectSubset<T, SpaceImageDeleteArgs<ExtArgs>>): Prisma__SpaceImageClient<$Result.GetResult<Prisma.$SpaceImagePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one SpaceImage.
     * @param {SpaceImageUpdateArgs} args - Arguments to update one SpaceImage.
     * @example
     * // Update one SpaceImage
     * const spaceImage = await prisma.spaceImage.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SpaceImageUpdateArgs>(args: SelectSubset<T, SpaceImageUpdateArgs<ExtArgs>>): Prisma__SpaceImageClient<$Result.GetResult<Prisma.$SpaceImagePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more SpaceImages.
     * @param {SpaceImageDeleteManyArgs} args - Arguments to filter SpaceImages to delete.
     * @example
     * // Delete a few SpaceImages
     * const { count } = await prisma.spaceImage.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SpaceImageDeleteManyArgs>(args?: SelectSubset<T, SpaceImageDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SpaceImages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SpaceImageUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many SpaceImages
     * const spaceImage = await prisma.spaceImage.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SpaceImageUpdateManyArgs>(args: SelectSubset<T, SpaceImageUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SpaceImages and returns the data updated in the database.
     * @param {SpaceImageUpdateManyAndReturnArgs} args - Arguments to update many SpaceImages.
     * @example
     * // Update many SpaceImages
     * const spaceImage = await prisma.spaceImage.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more SpaceImages and only return the `id`
     * const spaceImageWithIdOnly = await prisma.spaceImage.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends SpaceImageUpdateManyAndReturnArgs>(args: SelectSubset<T, SpaceImageUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SpaceImagePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one SpaceImage.
     * @param {SpaceImageUpsertArgs} args - Arguments to update or create a SpaceImage.
     * @example
     * // Update or create a SpaceImage
     * const spaceImage = await prisma.spaceImage.upsert({
     *   create: {
     *     // ... data to create a SpaceImage
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the SpaceImage we want to update
     *   }
     * })
     */
    upsert<T extends SpaceImageUpsertArgs>(args: SelectSubset<T, SpaceImageUpsertArgs<ExtArgs>>): Prisma__SpaceImageClient<$Result.GetResult<Prisma.$SpaceImagePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of SpaceImages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SpaceImageCountArgs} args - Arguments to filter SpaceImages to count.
     * @example
     * // Count the number of SpaceImages
     * const count = await prisma.spaceImage.count({
     *   where: {
     *     // ... the filter for the SpaceImages we want to count
     *   }
     * })
    **/
    count<T extends SpaceImageCountArgs>(
      args?: Subset<T, SpaceImageCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SpaceImageCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a SpaceImage.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SpaceImageAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SpaceImageAggregateArgs>(args: Subset<T, SpaceImageAggregateArgs>): Prisma.PrismaPromise<GetSpaceImageAggregateType<T>>

    /**
     * Group by SpaceImage.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SpaceImageGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SpaceImageGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SpaceImageGroupByArgs['orderBy'] }
        : { orderBy?: SpaceImageGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SpaceImageGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSpaceImageGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the SpaceImage model
   */
  readonly fields: SpaceImageFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for SpaceImage.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SpaceImageClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    space<T extends SpaceDefaultArgs<ExtArgs> = {}>(args?: Subset<T, SpaceDefaultArgs<ExtArgs>>): Prisma__SpaceClient<$Result.GetResult<Prisma.$SpacePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the SpaceImage model
   */
  interface SpaceImageFieldRefs {
    readonly id: FieldRef<"SpaceImage", 'String'>
    readonly url: FieldRef<"SpaceImage", 'String'>
    readonly order: FieldRef<"SpaceImage", 'Int'>
    readonly spaceId: FieldRef<"SpaceImage", 'String'>
  }
    

  // Custom InputTypes
  /**
   * SpaceImage findUnique
   */
  export type SpaceImageFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SpaceImage
     */
    select?: SpaceImageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SpaceImage
     */
    omit?: SpaceImageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SpaceImageInclude<ExtArgs> | null
    /**
     * Filter, which SpaceImage to fetch.
     */
    where: SpaceImageWhereUniqueInput
  }

  /**
   * SpaceImage findUniqueOrThrow
   */
  export type SpaceImageFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SpaceImage
     */
    select?: SpaceImageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SpaceImage
     */
    omit?: SpaceImageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SpaceImageInclude<ExtArgs> | null
    /**
     * Filter, which SpaceImage to fetch.
     */
    where: SpaceImageWhereUniqueInput
  }

  /**
   * SpaceImage findFirst
   */
  export type SpaceImageFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SpaceImage
     */
    select?: SpaceImageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SpaceImage
     */
    omit?: SpaceImageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SpaceImageInclude<ExtArgs> | null
    /**
     * Filter, which SpaceImage to fetch.
     */
    where?: SpaceImageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SpaceImages to fetch.
     */
    orderBy?: SpaceImageOrderByWithRelationInput | SpaceImageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SpaceImages.
     */
    cursor?: SpaceImageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SpaceImages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SpaceImages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SpaceImages.
     */
    distinct?: SpaceImageScalarFieldEnum | SpaceImageScalarFieldEnum[]
  }

  /**
   * SpaceImage findFirstOrThrow
   */
  export type SpaceImageFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SpaceImage
     */
    select?: SpaceImageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SpaceImage
     */
    omit?: SpaceImageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SpaceImageInclude<ExtArgs> | null
    /**
     * Filter, which SpaceImage to fetch.
     */
    where?: SpaceImageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SpaceImages to fetch.
     */
    orderBy?: SpaceImageOrderByWithRelationInput | SpaceImageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SpaceImages.
     */
    cursor?: SpaceImageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SpaceImages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SpaceImages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SpaceImages.
     */
    distinct?: SpaceImageScalarFieldEnum | SpaceImageScalarFieldEnum[]
  }

  /**
   * SpaceImage findMany
   */
  export type SpaceImageFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SpaceImage
     */
    select?: SpaceImageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SpaceImage
     */
    omit?: SpaceImageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SpaceImageInclude<ExtArgs> | null
    /**
     * Filter, which SpaceImages to fetch.
     */
    where?: SpaceImageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SpaceImages to fetch.
     */
    orderBy?: SpaceImageOrderByWithRelationInput | SpaceImageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing SpaceImages.
     */
    cursor?: SpaceImageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SpaceImages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SpaceImages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SpaceImages.
     */
    distinct?: SpaceImageScalarFieldEnum | SpaceImageScalarFieldEnum[]
  }

  /**
   * SpaceImage create
   */
  export type SpaceImageCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SpaceImage
     */
    select?: SpaceImageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SpaceImage
     */
    omit?: SpaceImageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SpaceImageInclude<ExtArgs> | null
    /**
     * The data needed to create a SpaceImage.
     */
    data: XOR<SpaceImageCreateInput, SpaceImageUncheckedCreateInput>
  }

  /**
   * SpaceImage createMany
   */
  export type SpaceImageCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many SpaceImages.
     */
    data: SpaceImageCreateManyInput | SpaceImageCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SpaceImage createManyAndReturn
   */
  export type SpaceImageCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SpaceImage
     */
    select?: SpaceImageSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SpaceImage
     */
    omit?: SpaceImageOmit<ExtArgs> | null
    /**
     * The data used to create many SpaceImages.
     */
    data: SpaceImageCreateManyInput | SpaceImageCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SpaceImageIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * SpaceImage update
   */
  export type SpaceImageUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SpaceImage
     */
    select?: SpaceImageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SpaceImage
     */
    omit?: SpaceImageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SpaceImageInclude<ExtArgs> | null
    /**
     * The data needed to update a SpaceImage.
     */
    data: XOR<SpaceImageUpdateInput, SpaceImageUncheckedUpdateInput>
    /**
     * Choose, which SpaceImage to update.
     */
    where: SpaceImageWhereUniqueInput
  }

  /**
   * SpaceImage updateMany
   */
  export type SpaceImageUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update SpaceImages.
     */
    data: XOR<SpaceImageUpdateManyMutationInput, SpaceImageUncheckedUpdateManyInput>
    /**
     * Filter which SpaceImages to update
     */
    where?: SpaceImageWhereInput
    /**
     * Limit how many SpaceImages to update.
     */
    limit?: number
  }

  /**
   * SpaceImage updateManyAndReturn
   */
  export type SpaceImageUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SpaceImage
     */
    select?: SpaceImageSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SpaceImage
     */
    omit?: SpaceImageOmit<ExtArgs> | null
    /**
     * The data used to update SpaceImages.
     */
    data: XOR<SpaceImageUpdateManyMutationInput, SpaceImageUncheckedUpdateManyInput>
    /**
     * Filter which SpaceImages to update
     */
    where?: SpaceImageWhereInput
    /**
     * Limit how many SpaceImages to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SpaceImageIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * SpaceImage upsert
   */
  export type SpaceImageUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SpaceImage
     */
    select?: SpaceImageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SpaceImage
     */
    omit?: SpaceImageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SpaceImageInclude<ExtArgs> | null
    /**
     * The filter to search for the SpaceImage to update in case it exists.
     */
    where: SpaceImageWhereUniqueInput
    /**
     * In case the SpaceImage found by the `where` argument doesn't exist, create a new SpaceImage with this data.
     */
    create: XOR<SpaceImageCreateInput, SpaceImageUncheckedCreateInput>
    /**
     * In case the SpaceImage was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SpaceImageUpdateInput, SpaceImageUncheckedUpdateInput>
  }

  /**
   * SpaceImage delete
   */
  export type SpaceImageDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SpaceImage
     */
    select?: SpaceImageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SpaceImage
     */
    omit?: SpaceImageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SpaceImageInclude<ExtArgs> | null
    /**
     * Filter which SpaceImage to delete.
     */
    where: SpaceImageWhereUniqueInput
  }

  /**
   * SpaceImage deleteMany
   */
  export type SpaceImageDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SpaceImages to delete
     */
    where?: SpaceImageWhereInput
    /**
     * Limit how many SpaceImages to delete.
     */
    limit?: number
  }

  /**
   * SpaceImage without action
   */
  export type SpaceImageDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SpaceImage
     */
    select?: SpaceImageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SpaceImage
     */
    omit?: SpaceImageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SpaceImageInclude<ExtArgs> | null
  }


  /**
   * Model SpaceAmenity
   */

  export type AggregateSpaceAmenity = {
    _count: SpaceAmenityCountAggregateOutputType | null
    _min: SpaceAmenityMinAggregateOutputType | null
    _max: SpaceAmenityMaxAggregateOutputType | null
  }

  export type SpaceAmenityMinAggregateOutputType = {
    spaceId: string | null
    amenityId: string | null
  }

  export type SpaceAmenityMaxAggregateOutputType = {
    spaceId: string | null
    amenityId: string | null
  }

  export type SpaceAmenityCountAggregateOutputType = {
    spaceId: number
    amenityId: number
    _all: number
  }


  export type SpaceAmenityMinAggregateInputType = {
    spaceId?: true
    amenityId?: true
  }

  export type SpaceAmenityMaxAggregateInputType = {
    spaceId?: true
    amenityId?: true
  }

  export type SpaceAmenityCountAggregateInputType = {
    spaceId?: true
    amenityId?: true
    _all?: true
  }

  export type SpaceAmenityAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SpaceAmenity to aggregate.
     */
    where?: SpaceAmenityWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SpaceAmenities to fetch.
     */
    orderBy?: SpaceAmenityOrderByWithRelationInput | SpaceAmenityOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SpaceAmenityWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SpaceAmenities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SpaceAmenities.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned SpaceAmenities
    **/
    _count?: true | SpaceAmenityCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SpaceAmenityMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SpaceAmenityMaxAggregateInputType
  }

  export type GetSpaceAmenityAggregateType<T extends SpaceAmenityAggregateArgs> = {
        [P in keyof T & keyof AggregateSpaceAmenity]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSpaceAmenity[P]>
      : GetScalarType<T[P], AggregateSpaceAmenity[P]>
  }




  export type SpaceAmenityGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SpaceAmenityWhereInput
    orderBy?: SpaceAmenityOrderByWithAggregationInput | SpaceAmenityOrderByWithAggregationInput[]
    by: SpaceAmenityScalarFieldEnum[] | SpaceAmenityScalarFieldEnum
    having?: SpaceAmenityScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SpaceAmenityCountAggregateInputType | true
    _min?: SpaceAmenityMinAggregateInputType
    _max?: SpaceAmenityMaxAggregateInputType
  }

  export type SpaceAmenityGroupByOutputType = {
    spaceId: string
    amenityId: string
    _count: SpaceAmenityCountAggregateOutputType | null
    _min: SpaceAmenityMinAggregateOutputType | null
    _max: SpaceAmenityMaxAggregateOutputType | null
  }

  type GetSpaceAmenityGroupByPayload<T extends SpaceAmenityGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SpaceAmenityGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SpaceAmenityGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SpaceAmenityGroupByOutputType[P]>
            : GetScalarType<T[P], SpaceAmenityGroupByOutputType[P]>
        }
      >
    >


  export type SpaceAmenitySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    spaceId?: boolean
    amenityId?: boolean
    space?: boolean | SpaceDefaultArgs<ExtArgs>
    amenity?: boolean | AmenityDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["spaceAmenity"]>

  export type SpaceAmenitySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    spaceId?: boolean
    amenityId?: boolean
    space?: boolean | SpaceDefaultArgs<ExtArgs>
    amenity?: boolean | AmenityDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["spaceAmenity"]>

  export type SpaceAmenitySelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    spaceId?: boolean
    amenityId?: boolean
    space?: boolean | SpaceDefaultArgs<ExtArgs>
    amenity?: boolean | AmenityDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["spaceAmenity"]>

  export type SpaceAmenitySelectScalar = {
    spaceId?: boolean
    amenityId?: boolean
  }

  export type SpaceAmenityOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"spaceId" | "amenityId", ExtArgs["result"]["spaceAmenity"]>
  export type SpaceAmenityInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    space?: boolean | SpaceDefaultArgs<ExtArgs>
    amenity?: boolean | AmenityDefaultArgs<ExtArgs>
  }
  export type SpaceAmenityIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    space?: boolean | SpaceDefaultArgs<ExtArgs>
    amenity?: boolean | AmenityDefaultArgs<ExtArgs>
  }
  export type SpaceAmenityIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    space?: boolean | SpaceDefaultArgs<ExtArgs>
    amenity?: boolean | AmenityDefaultArgs<ExtArgs>
  }

  export type $SpaceAmenityPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "SpaceAmenity"
    objects: {
      space: Prisma.$SpacePayload<ExtArgs>
      amenity: Prisma.$AmenityPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      spaceId: string
      amenityId: string
    }, ExtArgs["result"]["spaceAmenity"]>
    composites: {}
  }

  type SpaceAmenityGetPayload<S extends boolean | null | undefined | SpaceAmenityDefaultArgs> = $Result.GetResult<Prisma.$SpaceAmenityPayload, S>

  type SpaceAmenityCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SpaceAmenityFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SpaceAmenityCountAggregateInputType | true
    }

  export interface SpaceAmenityDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['SpaceAmenity'], meta: { name: 'SpaceAmenity' } }
    /**
     * Find zero or one SpaceAmenity that matches the filter.
     * @param {SpaceAmenityFindUniqueArgs} args - Arguments to find a SpaceAmenity
     * @example
     * // Get one SpaceAmenity
     * const spaceAmenity = await prisma.spaceAmenity.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SpaceAmenityFindUniqueArgs>(args: SelectSubset<T, SpaceAmenityFindUniqueArgs<ExtArgs>>): Prisma__SpaceAmenityClient<$Result.GetResult<Prisma.$SpaceAmenityPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one SpaceAmenity that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SpaceAmenityFindUniqueOrThrowArgs} args - Arguments to find a SpaceAmenity
     * @example
     * // Get one SpaceAmenity
     * const spaceAmenity = await prisma.spaceAmenity.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SpaceAmenityFindUniqueOrThrowArgs>(args: SelectSubset<T, SpaceAmenityFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SpaceAmenityClient<$Result.GetResult<Prisma.$SpaceAmenityPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SpaceAmenity that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SpaceAmenityFindFirstArgs} args - Arguments to find a SpaceAmenity
     * @example
     * // Get one SpaceAmenity
     * const spaceAmenity = await prisma.spaceAmenity.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SpaceAmenityFindFirstArgs>(args?: SelectSubset<T, SpaceAmenityFindFirstArgs<ExtArgs>>): Prisma__SpaceAmenityClient<$Result.GetResult<Prisma.$SpaceAmenityPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SpaceAmenity that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SpaceAmenityFindFirstOrThrowArgs} args - Arguments to find a SpaceAmenity
     * @example
     * // Get one SpaceAmenity
     * const spaceAmenity = await prisma.spaceAmenity.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SpaceAmenityFindFirstOrThrowArgs>(args?: SelectSubset<T, SpaceAmenityFindFirstOrThrowArgs<ExtArgs>>): Prisma__SpaceAmenityClient<$Result.GetResult<Prisma.$SpaceAmenityPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more SpaceAmenities that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SpaceAmenityFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all SpaceAmenities
     * const spaceAmenities = await prisma.spaceAmenity.findMany()
     * 
     * // Get first 10 SpaceAmenities
     * const spaceAmenities = await prisma.spaceAmenity.findMany({ take: 10 })
     * 
     * // Only select the `spaceId`
     * const spaceAmenityWithSpaceIdOnly = await prisma.spaceAmenity.findMany({ select: { spaceId: true } })
     * 
     */
    findMany<T extends SpaceAmenityFindManyArgs>(args?: SelectSubset<T, SpaceAmenityFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SpaceAmenityPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a SpaceAmenity.
     * @param {SpaceAmenityCreateArgs} args - Arguments to create a SpaceAmenity.
     * @example
     * // Create one SpaceAmenity
     * const SpaceAmenity = await prisma.spaceAmenity.create({
     *   data: {
     *     // ... data to create a SpaceAmenity
     *   }
     * })
     * 
     */
    create<T extends SpaceAmenityCreateArgs>(args: SelectSubset<T, SpaceAmenityCreateArgs<ExtArgs>>): Prisma__SpaceAmenityClient<$Result.GetResult<Prisma.$SpaceAmenityPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many SpaceAmenities.
     * @param {SpaceAmenityCreateManyArgs} args - Arguments to create many SpaceAmenities.
     * @example
     * // Create many SpaceAmenities
     * const spaceAmenity = await prisma.spaceAmenity.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SpaceAmenityCreateManyArgs>(args?: SelectSubset<T, SpaceAmenityCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many SpaceAmenities and returns the data saved in the database.
     * @param {SpaceAmenityCreateManyAndReturnArgs} args - Arguments to create many SpaceAmenities.
     * @example
     * // Create many SpaceAmenities
     * const spaceAmenity = await prisma.spaceAmenity.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many SpaceAmenities and only return the `spaceId`
     * const spaceAmenityWithSpaceIdOnly = await prisma.spaceAmenity.createManyAndReturn({
     *   select: { spaceId: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SpaceAmenityCreateManyAndReturnArgs>(args?: SelectSubset<T, SpaceAmenityCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SpaceAmenityPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a SpaceAmenity.
     * @param {SpaceAmenityDeleteArgs} args - Arguments to delete one SpaceAmenity.
     * @example
     * // Delete one SpaceAmenity
     * const SpaceAmenity = await prisma.spaceAmenity.delete({
     *   where: {
     *     // ... filter to delete one SpaceAmenity
     *   }
     * })
     * 
     */
    delete<T extends SpaceAmenityDeleteArgs>(args: SelectSubset<T, SpaceAmenityDeleteArgs<ExtArgs>>): Prisma__SpaceAmenityClient<$Result.GetResult<Prisma.$SpaceAmenityPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one SpaceAmenity.
     * @param {SpaceAmenityUpdateArgs} args - Arguments to update one SpaceAmenity.
     * @example
     * // Update one SpaceAmenity
     * const spaceAmenity = await prisma.spaceAmenity.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SpaceAmenityUpdateArgs>(args: SelectSubset<T, SpaceAmenityUpdateArgs<ExtArgs>>): Prisma__SpaceAmenityClient<$Result.GetResult<Prisma.$SpaceAmenityPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more SpaceAmenities.
     * @param {SpaceAmenityDeleteManyArgs} args - Arguments to filter SpaceAmenities to delete.
     * @example
     * // Delete a few SpaceAmenities
     * const { count } = await prisma.spaceAmenity.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SpaceAmenityDeleteManyArgs>(args?: SelectSubset<T, SpaceAmenityDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SpaceAmenities.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SpaceAmenityUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many SpaceAmenities
     * const spaceAmenity = await prisma.spaceAmenity.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SpaceAmenityUpdateManyArgs>(args: SelectSubset<T, SpaceAmenityUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SpaceAmenities and returns the data updated in the database.
     * @param {SpaceAmenityUpdateManyAndReturnArgs} args - Arguments to update many SpaceAmenities.
     * @example
     * // Update many SpaceAmenities
     * const spaceAmenity = await prisma.spaceAmenity.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more SpaceAmenities and only return the `spaceId`
     * const spaceAmenityWithSpaceIdOnly = await prisma.spaceAmenity.updateManyAndReturn({
     *   select: { spaceId: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends SpaceAmenityUpdateManyAndReturnArgs>(args: SelectSubset<T, SpaceAmenityUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SpaceAmenityPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one SpaceAmenity.
     * @param {SpaceAmenityUpsertArgs} args - Arguments to update or create a SpaceAmenity.
     * @example
     * // Update or create a SpaceAmenity
     * const spaceAmenity = await prisma.spaceAmenity.upsert({
     *   create: {
     *     // ... data to create a SpaceAmenity
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the SpaceAmenity we want to update
     *   }
     * })
     */
    upsert<T extends SpaceAmenityUpsertArgs>(args: SelectSubset<T, SpaceAmenityUpsertArgs<ExtArgs>>): Prisma__SpaceAmenityClient<$Result.GetResult<Prisma.$SpaceAmenityPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of SpaceAmenities.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SpaceAmenityCountArgs} args - Arguments to filter SpaceAmenities to count.
     * @example
     * // Count the number of SpaceAmenities
     * const count = await prisma.spaceAmenity.count({
     *   where: {
     *     // ... the filter for the SpaceAmenities we want to count
     *   }
     * })
    **/
    count<T extends SpaceAmenityCountArgs>(
      args?: Subset<T, SpaceAmenityCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SpaceAmenityCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a SpaceAmenity.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SpaceAmenityAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SpaceAmenityAggregateArgs>(args: Subset<T, SpaceAmenityAggregateArgs>): Prisma.PrismaPromise<GetSpaceAmenityAggregateType<T>>

    /**
     * Group by SpaceAmenity.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SpaceAmenityGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SpaceAmenityGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SpaceAmenityGroupByArgs['orderBy'] }
        : { orderBy?: SpaceAmenityGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SpaceAmenityGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSpaceAmenityGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the SpaceAmenity model
   */
  readonly fields: SpaceAmenityFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for SpaceAmenity.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SpaceAmenityClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    space<T extends SpaceDefaultArgs<ExtArgs> = {}>(args?: Subset<T, SpaceDefaultArgs<ExtArgs>>): Prisma__SpaceClient<$Result.GetResult<Prisma.$SpacePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    amenity<T extends AmenityDefaultArgs<ExtArgs> = {}>(args?: Subset<T, AmenityDefaultArgs<ExtArgs>>): Prisma__AmenityClient<$Result.GetResult<Prisma.$AmenityPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the SpaceAmenity model
   */
  interface SpaceAmenityFieldRefs {
    readonly spaceId: FieldRef<"SpaceAmenity", 'String'>
    readonly amenityId: FieldRef<"SpaceAmenity", 'String'>
  }
    

  // Custom InputTypes
  /**
   * SpaceAmenity findUnique
   */
  export type SpaceAmenityFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SpaceAmenity
     */
    select?: SpaceAmenitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the SpaceAmenity
     */
    omit?: SpaceAmenityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SpaceAmenityInclude<ExtArgs> | null
    /**
     * Filter, which SpaceAmenity to fetch.
     */
    where: SpaceAmenityWhereUniqueInput
  }

  /**
   * SpaceAmenity findUniqueOrThrow
   */
  export type SpaceAmenityFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SpaceAmenity
     */
    select?: SpaceAmenitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the SpaceAmenity
     */
    omit?: SpaceAmenityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SpaceAmenityInclude<ExtArgs> | null
    /**
     * Filter, which SpaceAmenity to fetch.
     */
    where: SpaceAmenityWhereUniqueInput
  }

  /**
   * SpaceAmenity findFirst
   */
  export type SpaceAmenityFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SpaceAmenity
     */
    select?: SpaceAmenitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the SpaceAmenity
     */
    omit?: SpaceAmenityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SpaceAmenityInclude<ExtArgs> | null
    /**
     * Filter, which SpaceAmenity to fetch.
     */
    where?: SpaceAmenityWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SpaceAmenities to fetch.
     */
    orderBy?: SpaceAmenityOrderByWithRelationInput | SpaceAmenityOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SpaceAmenities.
     */
    cursor?: SpaceAmenityWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SpaceAmenities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SpaceAmenities.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SpaceAmenities.
     */
    distinct?: SpaceAmenityScalarFieldEnum | SpaceAmenityScalarFieldEnum[]
  }

  /**
   * SpaceAmenity findFirstOrThrow
   */
  export type SpaceAmenityFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SpaceAmenity
     */
    select?: SpaceAmenitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the SpaceAmenity
     */
    omit?: SpaceAmenityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SpaceAmenityInclude<ExtArgs> | null
    /**
     * Filter, which SpaceAmenity to fetch.
     */
    where?: SpaceAmenityWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SpaceAmenities to fetch.
     */
    orderBy?: SpaceAmenityOrderByWithRelationInput | SpaceAmenityOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SpaceAmenities.
     */
    cursor?: SpaceAmenityWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SpaceAmenities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SpaceAmenities.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SpaceAmenities.
     */
    distinct?: SpaceAmenityScalarFieldEnum | SpaceAmenityScalarFieldEnum[]
  }

  /**
   * SpaceAmenity findMany
   */
  export type SpaceAmenityFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SpaceAmenity
     */
    select?: SpaceAmenitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the SpaceAmenity
     */
    omit?: SpaceAmenityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SpaceAmenityInclude<ExtArgs> | null
    /**
     * Filter, which SpaceAmenities to fetch.
     */
    where?: SpaceAmenityWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SpaceAmenities to fetch.
     */
    orderBy?: SpaceAmenityOrderByWithRelationInput | SpaceAmenityOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing SpaceAmenities.
     */
    cursor?: SpaceAmenityWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SpaceAmenities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SpaceAmenities.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SpaceAmenities.
     */
    distinct?: SpaceAmenityScalarFieldEnum | SpaceAmenityScalarFieldEnum[]
  }

  /**
   * SpaceAmenity create
   */
  export type SpaceAmenityCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SpaceAmenity
     */
    select?: SpaceAmenitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the SpaceAmenity
     */
    omit?: SpaceAmenityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SpaceAmenityInclude<ExtArgs> | null
    /**
     * The data needed to create a SpaceAmenity.
     */
    data: XOR<SpaceAmenityCreateInput, SpaceAmenityUncheckedCreateInput>
  }

  /**
   * SpaceAmenity createMany
   */
  export type SpaceAmenityCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many SpaceAmenities.
     */
    data: SpaceAmenityCreateManyInput | SpaceAmenityCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SpaceAmenity createManyAndReturn
   */
  export type SpaceAmenityCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SpaceAmenity
     */
    select?: SpaceAmenitySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SpaceAmenity
     */
    omit?: SpaceAmenityOmit<ExtArgs> | null
    /**
     * The data used to create many SpaceAmenities.
     */
    data: SpaceAmenityCreateManyInput | SpaceAmenityCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SpaceAmenityIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * SpaceAmenity update
   */
  export type SpaceAmenityUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SpaceAmenity
     */
    select?: SpaceAmenitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the SpaceAmenity
     */
    omit?: SpaceAmenityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SpaceAmenityInclude<ExtArgs> | null
    /**
     * The data needed to update a SpaceAmenity.
     */
    data: XOR<SpaceAmenityUpdateInput, SpaceAmenityUncheckedUpdateInput>
    /**
     * Choose, which SpaceAmenity to update.
     */
    where: SpaceAmenityWhereUniqueInput
  }

  /**
   * SpaceAmenity updateMany
   */
  export type SpaceAmenityUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update SpaceAmenities.
     */
    data: XOR<SpaceAmenityUpdateManyMutationInput, SpaceAmenityUncheckedUpdateManyInput>
    /**
     * Filter which SpaceAmenities to update
     */
    where?: SpaceAmenityWhereInput
    /**
     * Limit how many SpaceAmenities to update.
     */
    limit?: number
  }

  /**
   * SpaceAmenity updateManyAndReturn
   */
  export type SpaceAmenityUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SpaceAmenity
     */
    select?: SpaceAmenitySelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SpaceAmenity
     */
    omit?: SpaceAmenityOmit<ExtArgs> | null
    /**
     * The data used to update SpaceAmenities.
     */
    data: XOR<SpaceAmenityUpdateManyMutationInput, SpaceAmenityUncheckedUpdateManyInput>
    /**
     * Filter which SpaceAmenities to update
     */
    where?: SpaceAmenityWhereInput
    /**
     * Limit how many SpaceAmenities to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SpaceAmenityIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * SpaceAmenity upsert
   */
  export type SpaceAmenityUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SpaceAmenity
     */
    select?: SpaceAmenitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the SpaceAmenity
     */
    omit?: SpaceAmenityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SpaceAmenityInclude<ExtArgs> | null
    /**
     * The filter to search for the SpaceAmenity to update in case it exists.
     */
    where: SpaceAmenityWhereUniqueInput
    /**
     * In case the SpaceAmenity found by the `where` argument doesn't exist, create a new SpaceAmenity with this data.
     */
    create: XOR<SpaceAmenityCreateInput, SpaceAmenityUncheckedCreateInput>
    /**
     * In case the SpaceAmenity was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SpaceAmenityUpdateInput, SpaceAmenityUncheckedUpdateInput>
  }

  /**
   * SpaceAmenity delete
   */
  export type SpaceAmenityDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SpaceAmenity
     */
    select?: SpaceAmenitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the SpaceAmenity
     */
    omit?: SpaceAmenityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SpaceAmenityInclude<ExtArgs> | null
    /**
     * Filter which SpaceAmenity to delete.
     */
    where: SpaceAmenityWhereUniqueInput
  }

  /**
   * SpaceAmenity deleteMany
   */
  export type SpaceAmenityDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SpaceAmenities to delete
     */
    where?: SpaceAmenityWhereInput
    /**
     * Limit how many SpaceAmenities to delete.
     */
    limit?: number
  }

  /**
   * SpaceAmenity without action
   */
  export type SpaceAmenityDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SpaceAmenity
     */
    select?: SpaceAmenitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the SpaceAmenity
     */
    omit?: SpaceAmenityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SpaceAmenityInclude<ExtArgs> | null
  }


  /**
   * Model Booking
   */

  export type AggregateBooking = {
    _count: BookingCountAggregateOutputType | null
    _avg: BookingAvgAggregateOutputType | null
    _sum: BookingSumAggregateOutputType | null
    _min: BookingMinAggregateOutputType | null
    _max: BookingMaxAggregateOutputType | null
  }

  export type BookingAvgAggregateOutputType = {
    persons: number | null
  }

  export type BookingSumAggregateOutputType = {
    persons: number | null
  }

  export type BookingMinAggregateOutputType = {
    id: string | null
    date: string | null
    startTime: string | null
    endTime: string | null
    persons: number | null
    notes: string | null
    status: $Enums.BookingStatus | null
    sellerNote: string | null
    createdAt: Date | null
    updatedAt: Date | null
    spaceId: string | null
    buyerId: string | null
  }

  export type BookingMaxAggregateOutputType = {
    id: string | null
    date: string | null
    startTime: string | null
    endTime: string | null
    persons: number | null
    notes: string | null
    status: $Enums.BookingStatus | null
    sellerNote: string | null
    createdAt: Date | null
    updatedAt: Date | null
    spaceId: string | null
    buyerId: string | null
  }

  export type BookingCountAggregateOutputType = {
    id: number
    date: number
    startTime: number
    endTime: number
    persons: number
    notes: number
    status: number
    sellerNote: number
    createdAt: number
    updatedAt: number
    spaceId: number
    buyerId: number
    _all: number
  }


  export type BookingAvgAggregateInputType = {
    persons?: true
  }

  export type BookingSumAggregateInputType = {
    persons?: true
  }

  export type BookingMinAggregateInputType = {
    id?: true
    date?: true
    startTime?: true
    endTime?: true
    persons?: true
    notes?: true
    status?: true
    sellerNote?: true
    createdAt?: true
    updatedAt?: true
    spaceId?: true
    buyerId?: true
  }

  export type BookingMaxAggregateInputType = {
    id?: true
    date?: true
    startTime?: true
    endTime?: true
    persons?: true
    notes?: true
    status?: true
    sellerNote?: true
    createdAt?: true
    updatedAt?: true
    spaceId?: true
    buyerId?: true
  }

  export type BookingCountAggregateInputType = {
    id?: true
    date?: true
    startTime?: true
    endTime?: true
    persons?: true
    notes?: true
    status?: true
    sellerNote?: true
    createdAt?: true
    updatedAt?: true
    spaceId?: true
    buyerId?: true
    _all?: true
  }

  export type BookingAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Booking to aggregate.
     */
    where?: BookingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Bookings to fetch.
     */
    orderBy?: BookingOrderByWithRelationInput | BookingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: BookingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Bookings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Bookings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Bookings
    **/
    _count?: true | BookingCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: BookingAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: BookingSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: BookingMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: BookingMaxAggregateInputType
  }

  export type GetBookingAggregateType<T extends BookingAggregateArgs> = {
        [P in keyof T & keyof AggregateBooking]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateBooking[P]>
      : GetScalarType<T[P], AggregateBooking[P]>
  }




  export type BookingGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BookingWhereInput
    orderBy?: BookingOrderByWithAggregationInput | BookingOrderByWithAggregationInput[]
    by: BookingScalarFieldEnum[] | BookingScalarFieldEnum
    having?: BookingScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: BookingCountAggregateInputType | true
    _avg?: BookingAvgAggregateInputType
    _sum?: BookingSumAggregateInputType
    _min?: BookingMinAggregateInputType
    _max?: BookingMaxAggregateInputType
  }

  export type BookingGroupByOutputType = {
    id: string
    date: string
    startTime: string
    endTime: string
    persons: number | null
    notes: string | null
    status: $Enums.BookingStatus
    sellerNote: string | null
    createdAt: Date
    updatedAt: Date
    spaceId: string
    buyerId: string
    _count: BookingCountAggregateOutputType | null
    _avg: BookingAvgAggregateOutputType | null
    _sum: BookingSumAggregateOutputType | null
    _min: BookingMinAggregateOutputType | null
    _max: BookingMaxAggregateOutputType | null
  }

  type GetBookingGroupByPayload<T extends BookingGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<BookingGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof BookingGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], BookingGroupByOutputType[P]>
            : GetScalarType<T[P], BookingGroupByOutputType[P]>
        }
      >
    >


  export type BookingSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    date?: boolean
    startTime?: boolean
    endTime?: boolean
    persons?: boolean
    notes?: boolean
    status?: boolean
    sellerNote?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    spaceId?: boolean
    buyerId?: boolean
    space?: boolean | SpaceDefaultArgs<ExtArgs>
    buyer?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["booking"]>

  export type BookingSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    date?: boolean
    startTime?: boolean
    endTime?: boolean
    persons?: boolean
    notes?: boolean
    status?: boolean
    sellerNote?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    spaceId?: boolean
    buyerId?: boolean
    space?: boolean | SpaceDefaultArgs<ExtArgs>
    buyer?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["booking"]>

  export type BookingSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    date?: boolean
    startTime?: boolean
    endTime?: boolean
    persons?: boolean
    notes?: boolean
    status?: boolean
    sellerNote?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    spaceId?: boolean
    buyerId?: boolean
    space?: boolean | SpaceDefaultArgs<ExtArgs>
    buyer?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["booking"]>

  export type BookingSelectScalar = {
    id?: boolean
    date?: boolean
    startTime?: boolean
    endTime?: boolean
    persons?: boolean
    notes?: boolean
    status?: boolean
    sellerNote?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    spaceId?: boolean
    buyerId?: boolean
  }

  export type BookingOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "date" | "startTime" | "endTime" | "persons" | "notes" | "status" | "sellerNote" | "createdAt" | "updatedAt" | "spaceId" | "buyerId", ExtArgs["result"]["booking"]>
  export type BookingInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    space?: boolean | SpaceDefaultArgs<ExtArgs>
    buyer?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type BookingIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    space?: boolean | SpaceDefaultArgs<ExtArgs>
    buyer?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type BookingIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    space?: boolean | SpaceDefaultArgs<ExtArgs>
    buyer?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $BookingPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Booking"
    objects: {
      space: Prisma.$SpacePayload<ExtArgs>
      buyer: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      date: string
      startTime: string
      endTime: string
      persons: number | null
      notes: string | null
      status: $Enums.BookingStatus
      sellerNote: string | null
      createdAt: Date
      updatedAt: Date
      spaceId: string
      buyerId: string
    }, ExtArgs["result"]["booking"]>
    composites: {}
  }

  type BookingGetPayload<S extends boolean | null | undefined | BookingDefaultArgs> = $Result.GetResult<Prisma.$BookingPayload, S>

  type BookingCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<BookingFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: BookingCountAggregateInputType | true
    }

  export interface BookingDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Booking'], meta: { name: 'Booking' } }
    /**
     * Find zero or one Booking that matches the filter.
     * @param {BookingFindUniqueArgs} args - Arguments to find a Booking
     * @example
     * // Get one Booking
     * const booking = await prisma.booking.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends BookingFindUniqueArgs>(args: SelectSubset<T, BookingFindUniqueArgs<ExtArgs>>): Prisma__BookingClient<$Result.GetResult<Prisma.$BookingPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Booking that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {BookingFindUniqueOrThrowArgs} args - Arguments to find a Booking
     * @example
     * // Get one Booking
     * const booking = await prisma.booking.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends BookingFindUniqueOrThrowArgs>(args: SelectSubset<T, BookingFindUniqueOrThrowArgs<ExtArgs>>): Prisma__BookingClient<$Result.GetResult<Prisma.$BookingPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Booking that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookingFindFirstArgs} args - Arguments to find a Booking
     * @example
     * // Get one Booking
     * const booking = await prisma.booking.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends BookingFindFirstArgs>(args?: SelectSubset<T, BookingFindFirstArgs<ExtArgs>>): Prisma__BookingClient<$Result.GetResult<Prisma.$BookingPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Booking that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookingFindFirstOrThrowArgs} args - Arguments to find a Booking
     * @example
     * // Get one Booking
     * const booking = await prisma.booking.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends BookingFindFirstOrThrowArgs>(args?: SelectSubset<T, BookingFindFirstOrThrowArgs<ExtArgs>>): Prisma__BookingClient<$Result.GetResult<Prisma.$BookingPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Bookings that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookingFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Bookings
     * const bookings = await prisma.booking.findMany()
     * 
     * // Get first 10 Bookings
     * const bookings = await prisma.booking.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const bookingWithIdOnly = await prisma.booking.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends BookingFindManyArgs>(args?: SelectSubset<T, BookingFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BookingPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Booking.
     * @param {BookingCreateArgs} args - Arguments to create a Booking.
     * @example
     * // Create one Booking
     * const Booking = await prisma.booking.create({
     *   data: {
     *     // ... data to create a Booking
     *   }
     * })
     * 
     */
    create<T extends BookingCreateArgs>(args: SelectSubset<T, BookingCreateArgs<ExtArgs>>): Prisma__BookingClient<$Result.GetResult<Prisma.$BookingPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Bookings.
     * @param {BookingCreateManyArgs} args - Arguments to create many Bookings.
     * @example
     * // Create many Bookings
     * const booking = await prisma.booking.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends BookingCreateManyArgs>(args?: SelectSubset<T, BookingCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Bookings and returns the data saved in the database.
     * @param {BookingCreateManyAndReturnArgs} args - Arguments to create many Bookings.
     * @example
     * // Create many Bookings
     * const booking = await prisma.booking.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Bookings and only return the `id`
     * const bookingWithIdOnly = await prisma.booking.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends BookingCreateManyAndReturnArgs>(args?: SelectSubset<T, BookingCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BookingPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Booking.
     * @param {BookingDeleteArgs} args - Arguments to delete one Booking.
     * @example
     * // Delete one Booking
     * const Booking = await prisma.booking.delete({
     *   where: {
     *     // ... filter to delete one Booking
     *   }
     * })
     * 
     */
    delete<T extends BookingDeleteArgs>(args: SelectSubset<T, BookingDeleteArgs<ExtArgs>>): Prisma__BookingClient<$Result.GetResult<Prisma.$BookingPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Booking.
     * @param {BookingUpdateArgs} args - Arguments to update one Booking.
     * @example
     * // Update one Booking
     * const booking = await prisma.booking.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends BookingUpdateArgs>(args: SelectSubset<T, BookingUpdateArgs<ExtArgs>>): Prisma__BookingClient<$Result.GetResult<Prisma.$BookingPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Bookings.
     * @param {BookingDeleteManyArgs} args - Arguments to filter Bookings to delete.
     * @example
     * // Delete a few Bookings
     * const { count } = await prisma.booking.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends BookingDeleteManyArgs>(args?: SelectSubset<T, BookingDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Bookings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookingUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Bookings
     * const booking = await prisma.booking.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends BookingUpdateManyArgs>(args: SelectSubset<T, BookingUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Bookings and returns the data updated in the database.
     * @param {BookingUpdateManyAndReturnArgs} args - Arguments to update many Bookings.
     * @example
     * // Update many Bookings
     * const booking = await prisma.booking.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Bookings and only return the `id`
     * const bookingWithIdOnly = await prisma.booking.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends BookingUpdateManyAndReturnArgs>(args: SelectSubset<T, BookingUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BookingPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Booking.
     * @param {BookingUpsertArgs} args - Arguments to update or create a Booking.
     * @example
     * // Update or create a Booking
     * const booking = await prisma.booking.upsert({
     *   create: {
     *     // ... data to create a Booking
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Booking we want to update
     *   }
     * })
     */
    upsert<T extends BookingUpsertArgs>(args: SelectSubset<T, BookingUpsertArgs<ExtArgs>>): Prisma__BookingClient<$Result.GetResult<Prisma.$BookingPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Bookings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookingCountArgs} args - Arguments to filter Bookings to count.
     * @example
     * // Count the number of Bookings
     * const count = await prisma.booking.count({
     *   where: {
     *     // ... the filter for the Bookings we want to count
     *   }
     * })
    **/
    count<T extends BookingCountArgs>(
      args?: Subset<T, BookingCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], BookingCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Booking.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookingAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends BookingAggregateArgs>(args: Subset<T, BookingAggregateArgs>): Prisma.PrismaPromise<GetBookingAggregateType<T>>

    /**
     * Group by Booking.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookingGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends BookingGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: BookingGroupByArgs['orderBy'] }
        : { orderBy?: BookingGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, BookingGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetBookingGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Booking model
   */
  readonly fields: BookingFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Booking.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__BookingClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    space<T extends SpaceDefaultArgs<ExtArgs> = {}>(args?: Subset<T, SpaceDefaultArgs<ExtArgs>>): Prisma__SpaceClient<$Result.GetResult<Prisma.$SpacePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    buyer<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Booking model
   */
  interface BookingFieldRefs {
    readonly id: FieldRef<"Booking", 'String'>
    readonly date: FieldRef<"Booking", 'String'>
    readonly startTime: FieldRef<"Booking", 'String'>
    readonly endTime: FieldRef<"Booking", 'String'>
    readonly persons: FieldRef<"Booking", 'Int'>
    readonly notes: FieldRef<"Booking", 'String'>
    readonly status: FieldRef<"Booking", 'BookingStatus'>
    readonly sellerNote: FieldRef<"Booking", 'String'>
    readonly createdAt: FieldRef<"Booking", 'DateTime'>
    readonly updatedAt: FieldRef<"Booking", 'DateTime'>
    readonly spaceId: FieldRef<"Booking", 'String'>
    readonly buyerId: FieldRef<"Booking", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Booking findUnique
   */
  export type BookingFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Booking
     */
    select?: BookingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Booking
     */
    omit?: BookingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingInclude<ExtArgs> | null
    /**
     * Filter, which Booking to fetch.
     */
    where: BookingWhereUniqueInput
  }

  /**
   * Booking findUniqueOrThrow
   */
  export type BookingFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Booking
     */
    select?: BookingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Booking
     */
    omit?: BookingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingInclude<ExtArgs> | null
    /**
     * Filter, which Booking to fetch.
     */
    where: BookingWhereUniqueInput
  }

  /**
   * Booking findFirst
   */
  export type BookingFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Booking
     */
    select?: BookingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Booking
     */
    omit?: BookingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingInclude<ExtArgs> | null
    /**
     * Filter, which Booking to fetch.
     */
    where?: BookingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Bookings to fetch.
     */
    orderBy?: BookingOrderByWithRelationInput | BookingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Bookings.
     */
    cursor?: BookingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Bookings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Bookings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Bookings.
     */
    distinct?: BookingScalarFieldEnum | BookingScalarFieldEnum[]
  }

  /**
   * Booking findFirstOrThrow
   */
  export type BookingFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Booking
     */
    select?: BookingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Booking
     */
    omit?: BookingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingInclude<ExtArgs> | null
    /**
     * Filter, which Booking to fetch.
     */
    where?: BookingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Bookings to fetch.
     */
    orderBy?: BookingOrderByWithRelationInput | BookingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Bookings.
     */
    cursor?: BookingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Bookings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Bookings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Bookings.
     */
    distinct?: BookingScalarFieldEnum | BookingScalarFieldEnum[]
  }

  /**
   * Booking findMany
   */
  export type BookingFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Booking
     */
    select?: BookingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Booking
     */
    omit?: BookingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingInclude<ExtArgs> | null
    /**
     * Filter, which Bookings to fetch.
     */
    where?: BookingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Bookings to fetch.
     */
    orderBy?: BookingOrderByWithRelationInput | BookingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Bookings.
     */
    cursor?: BookingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Bookings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Bookings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Bookings.
     */
    distinct?: BookingScalarFieldEnum | BookingScalarFieldEnum[]
  }

  /**
   * Booking create
   */
  export type BookingCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Booking
     */
    select?: BookingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Booking
     */
    omit?: BookingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingInclude<ExtArgs> | null
    /**
     * The data needed to create a Booking.
     */
    data: XOR<BookingCreateInput, BookingUncheckedCreateInput>
  }

  /**
   * Booking createMany
   */
  export type BookingCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Bookings.
     */
    data: BookingCreateManyInput | BookingCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Booking createManyAndReturn
   */
  export type BookingCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Booking
     */
    select?: BookingSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Booking
     */
    omit?: BookingOmit<ExtArgs> | null
    /**
     * The data used to create many Bookings.
     */
    data: BookingCreateManyInput | BookingCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Booking update
   */
  export type BookingUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Booking
     */
    select?: BookingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Booking
     */
    omit?: BookingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingInclude<ExtArgs> | null
    /**
     * The data needed to update a Booking.
     */
    data: XOR<BookingUpdateInput, BookingUncheckedUpdateInput>
    /**
     * Choose, which Booking to update.
     */
    where: BookingWhereUniqueInput
  }

  /**
   * Booking updateMany
   */
  export type BookingUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Bookings.
     */
    data: XOR<BookingUpdateManyMutationInput, BookingUncheckedUpdateManyInput>
    /**
     * Filter which Bookings to update
     */
    where?: BookingWhereInput
    /**
     * Limit how many Bookings to update.
     */
    limit?: number
  }

  /**
   * Booking updateManyAndReturn
   */
  export type BookingUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Booking
     */
    select?: BookingSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Booking
     */
    omit?: BookingOmit<ExtArgs> | null
    /**
     * The data used to update Bookings.
     */
    data: XOR<BookingUpdateManyMutationInput, BookingUncheckedUpdateManyInput>
    /**
     * Filter which Bookings to update
     */
    where?: BookingWhereInput
    /**
     * Limit how many Bookings to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Booking upsert
   */
  export type BookingUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Booking
     */
    select?: BookingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Booking
     */
    omit?: BookingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingInclude<ExtArgs> | null
    /**
     * The filter to search for the Booking to update in case it exists.
     */
    where: BookingWhereUniqueInput
    /**
     * In case the Booking found by the `where` argument doesn't exist, create a new Booking with this data.
     */
    create: XOR<BookingCreateInput, BookingUncheckedCreateInput>
    /**
     * In case the Booking was found with the provided `where` argument, update it with this data.
     */
    update: XOR<BookingUpdateInput, BookingUncheckedUpdateInput>
  }

  /**
   * Booking delete
   */
  export type BookingDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Booking
     */
    select?: BookingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Booking
     */
    omit?: BookingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingInclude<ExtArgs> | null
    /**
     * Filter which Booking to delete.
     */
    where: BookingWhereUniqueInput
  }

  /**
   * Booking deleteMany
   */
  export type BookingDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Bookings to delete
     */
    where?: BookingWhereInput
    /**
     * Limit how many Bookings to delete.
     */
    limit?: number
  }

  /**
   * Booking without action
   */
  export type BookingDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Booking
     */
    select?: BookingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Booking
     */
    omit?: BookingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UserScalarFieldEnum: {
    id: 'id',
    name: 'name',
    email: 'email',
    phone: 'phone',
    password: 'password',
    role: 'role',
    status: 'status',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const SpaceTypeScalarFieldEnum: {
    id: 'id',
    name: 'name'
  };

  export type SpaceTypeScalarFieldEnum = (typeof SpaceTypeScalarFieldEnum)[keyof typeof SpaceTypeScalarFieldEnum]


  export const AmenityScalarFieldEnum: {
    id: 'id',
    name: 'name',
    icon: 'icon'
  };

  export type AmenityScalarFieldEnum = (typeof AmenityScalarFieldEnum)[keyof typeof AmenityScalarFieldEnum]


  export const SpaceScalarFieldEnum: {
    id: 'id',
    name: 'name',
    description: 'description',
    city: 'city',
    district: 'district',
    address: 'address',
    capacity: 'capacity',
    price: 'price',
    pricePeriod: 'pricePeriod',
    status: 'status',
    adminNotes: 'adminNotes',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    typeId: 'typeId',
    sellerId: 'sellerId'
  };

  export type SpaceScalarFieldEnum = (typeof SpaceScalarFieldEnum)[keyof typeof SpaceScalarFieldEnum]


  export const SpaceImageScalarFieldEnum: {
    id: 'id',
    url: 'url',
    order: 'order',
    spaceId: 'spaceId'
  };

  export type SpaceImageScalarFieldEnum = (typeof SpaceImageScalarFieldEnum)[keyof typeof SpaceImageScalarFieldEnum]


  export const SpaceAmenityScalarFieldEnum: {
    spaceId: 'spaceId',
    amenityId: 'amenityId'
  };

  export type SpaceAmenityScalarFieldEnum = (typeof SpaceAmenityScalarFieldEnum)[keyof typeof SpaceAmenityScalarFieldEnum]


  export const BookingScalarFieldEnum: {
    id: 'id',
    date: 'date',
    startTime: 'startTime',
    endTime: 'endTime',
    persons: 'persons',
    notes: 'notes',
    status: 'status',
    sellerNote: 'sellerNote',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    spaceId: 'spaceId',
    buyerId: 'buyerId'
  };

  export type BookingScalarFieldEnum = (typeof BookingScalarFieldEnum)[keyof typeof BookingScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'Role'
   */
  export type EnumRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Role'>
    


  /**
   * Reference to a field of type 'Role[]'
   */
  export type ListEnumRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Role[]'>
    


  /**
   * Reference to a field of type 'UserStatus'
   */
  export type EnumUserStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'UserStatus'>
    


  /**
   * Reference to a field of type 'UserStatus[]'
   */
  export type ListEnumUserStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'UserStatus[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    


  /**
   * Reference to a field of type 'SpaceStatus'
   */
  export type EnumSpaceStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'SpaceStatus'>
    


  /**
   * Reference to a field of type 'SpaceStatus[]'
   */
  export type ListEnumSpaceStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'SpaceStatus[]'>
    


  /**
   * Reference to a field of type 'BookingStatus'
   */
  export type EnumBookingStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BookingStatus'>
    


  /**
   * Reference to a field of type 'BookingStatus[]'
   */
  export type ListEnumBookingStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BookingStatus[]'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    name?: StringFilter<"User"> | string
    email?: StringFilter<"User"> | string
    phone?: StringNullableFilter<"User"> | string | null
    password?: StringFilter<"User"> | string
    role?: EnumRoleFilter<"User"> | $Enums.Role
    status?: EnumUserStatusFilter<"User"> | $Enums.UserStatus
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    spaces?: SpaceListRelationFilter
    bookings?: BookingListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    phone?: SortOrderInput | SortOrder
    password?: SortOrder
    role?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    spaces?: SpaceOrderByRelationAggregateInput
    bookings?: BookingOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    name?: StringFilter<"User"> | string
    phone?: StringNullableFilter<"User"> | string | null
    password?: StringFilter<"User"> | string
    role?: EnumRoleFilter<"User"> | $Enums.Role
    status?: EnumUserStatusFilter<"User"> | $Enums.UserStatus
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    spaces?: SpaceListRelationFilter
    bookings?: BookingListRelationFilter
  }, "id" | "email">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    phone?: SortOrderInput | SortOrder
    password?: SortOrder
    role?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    name?: StringWithAggregatesFilter<"User"> | string
    email?: StringWithAggregatesFilter<"User"> | string
    phone?: StringNullableWithAggregatesFilter<"User"> | string | null
    password?: StringWithAggregatesFilter<"User"> | string
    role?: EnumRoleWithAggregatesFilter<"User"> | $Enums.Role
    status?: EnumUserStatusWithAggregatesFilter<"User"> | $Enums.UserStatus
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
  }

  export type SpaceTypeWhereInput = {
    AND?: SpaceTypeWhereInput | SpaceTypeWhereInput[]
    OR?: SpaceTypeWhereInput[]
    NOT?: SpaceTypeWhereInput | SpaceTypeWhereInput[]
    id?: StringFilter<"SpaceType"> | string
    name?: StringFilter<"SpaceType"> | string
    spaces?: SpaceListRelationFilter
  }

  export type SpaceTypeOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    spaces?: SpaceOrderByRelationAggregateInput
  }

  export type SpaceTypeWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    name?: string
    AND?: SpaceTypeWhereInput | SpaceTypeWhereInput[]
    OR?: SpaceTypeWhereInput[]
    NOT?: SpaceTypeWhereInput | SpaceTypeWhereInput[]
    spaces?: SpaceListRelationFilter
  }, "id" | "name">

  export type SpaceTypeOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    _count?: SpaceTypeCountOrderByAggregateInput
    _max?: SpaceTypeMaxOrderByAggregateInput
    _min?: SpaceTypeMinOrderByAggregateInput
  }

  export type SpaceTypeScalarWhereWithAggregatesInput = {
    AND?: SpaceTypeScalarWhereWithAggregatesInput | SpaceTypeScalarWhereWithAggregatesInput[]
    OR?: SpaceTypeScalarWhereWithAggregatesInput[]
    NOT?: SpaceTypeScalarWhereWithAggregatesInput | SpaceTypeScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"SpaceType"> | string
    name?: StringWithAggregatesFilter<"SpaceType"> | string
  }

  export type AmenityWhereInput = {
    AND?: AmenityWhereInput | AmenityWhereInput[]
    OR?: AmenityWhereInput[]
    NOT?: AmenityWhereInput | AmenityWhereInput[]
    id?: StringFilter<"Amenity"> | string
    name?: StringFilter<"Amenity"> | string
    icon?: StringNullableFilter<"Amenity"> | string | null
    spaces?: SpaceAmenityListRelationFilter
  }

  export type AmenityOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    icon?: SortOrderInput | SortOrder
    spaces?: SpaceAmenityOrderByRelationAggregateInput
  }

  export type AmenityWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    name?: string
    AND?: AmenityWhereInput | AmenityWhereInput[]
    OR?: AmenityWhereInput[]
    NOT?: AmenityWhereInput | AmenityWhereInput[]
    icon?: StringNullableFilter<"Amenity"> | string | null
    spaces?: SpaceAmenityListRelationFilter
  }, "id" | "name">

  export type AmenityOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    icon?: SortOrderInput | SortOrder
    _count?: AmenityCountOrderByAggregateInput
    _max?: AmenityMaxOrderByAggregateInput
    _min?: AmenityMinOrderByAggregateInput
  }

  export type AmenityScalarWhereWithAggregatesInput = {
    AND?: AmenityScalarWhereWithAggregatesInput | AmenityScalarWhereWithAggregatesInput[]
    OR?: AmenityScalarWhereWithAggregatesInput[]
    NOT?: AmenityScalarWhereWithAggregatesInput | AmenityScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Amenity"> | string
    name?: StringWithAggregatesFilter<"Amenity"> | string
    icon?: StringNullableWithAggregatesFilter<"Amenity"> | string | null
  }

  export type SpaceWhereInput = {
    AND?: SpaceWhereInput | SpaceWhereInput[]
    OR?: SpaceWhereInput[]
    NOT?: SpaceWhereInput | SpaceWhereInput[]
    id?: StringFilter<"Space"> | string
    name?: StringFilter<"Space"> | string
    description?: StringNullableFilter<"Space"> | string | null
    city?: StringFilter<"Space"> | string
    district?: StringNullableFilter<"Space"> | string | null
    address?: StringNullableFilter<"Space"> | string | null
    capacity?: IntNullableFilter<"Space"> | number | null
    price?: FloatFilter<"Space"> | number
    pricePeriod?: StringFilter<"Space"> | string
    status?: EnumSpaceStatusFilter<"Space"> | $Enums.SpaceStatus
    adminNotes?: StringNullableFilter<"Space"> | string | null
    createdAt?: DateTimeFilter<"Space"> | Date | string
    updatedAt?: DateTimeFilter<"Space"> | Date | string
    typeId?: StringFilter<"Space"> | string
    sellerId?: StringFilter<"Space"> | string
    type?: XOR<SpaceTypeScalarRelationFilter, SpaceTypeWhereInput>
    seller?: XOR<UserScalarRelationFilter, UserWhereInput>
    images?: SpaceImageListRelationFilter
    amenities?: SpaceAmenityListRelationFilter
    bookings?: BookingListRelationFilter
  }

  export type SpaceOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    city?: SortOrder
    district?: SortOrderInput | SortOrder
    address?: SortOrderInput | SortOrder
    capacity?: SortOrderInput | SortOrder
    price?: SortOrder
    pricePeriod?: SortOrder
    status?: SortOrder
    adminNotes?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    typeId?: SortOrder
    sellerId?: SortOrder
    type?: SpaceTypeOrderByWithRelationInput
    seller?: UserOrderByWithRelationInput
    images?: SpaceImageOrderByRelationAggregateInput
    amenities?: SpaceAmenityOrderByRelationAggregateInput
    bookings?: BookingOrderByRelationAggregateInput
  }

  export type SpaceWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: SpaceWhereInput | SpaceWhereInput[]
    OR?: SpaceWhereInput[]
    NOT?: SpaceWhereInput | SpaceWhereInput[]
    name?: StringFilter<"Space"> | string
    description?: StringNullableFilter<"Space"> | string | null
    city?: StringFilter<"Space"> | string
    district?: StringNullableFilter<"Space"> | string | null
    address?: StringNullableFilter<"Space"> | string | null
    capacity?: IntNullableFilter<"Space"> | number | null
    price?: FloatFilter<"Space"> | number
    pricePeriod?: StringFilter<"Space"> | string
    status?: EnumSpaceStatusFilter<"Space"> | $Enums.SpaceStatus
    adminNotes?: StringNullableFilter<"Space"> | string | null
    createdAt?: DateTimeFilter<"Space"> | Date | string
    updatedAt?: DateTimeFilter<"Space"> | Date | string
    typeId?: StringFilter<"Space"> | string
    sellerId?: StringFilter<"Space"> | string
    type?: XOR<SpaceTypeScalarRelationFilter, SpaceTypeWhereInput>
    seller?: XOR<UserScalarRelationFilter, UserWhereInput>
    images?: SpaceImageListRelationFilter
    amenities?: SpaceAmenityListRelationFilter
    bookings?: BookingListRelationFilter
  }, "id">

  export type SpaceOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    city?: SortOrder
    district?: SortOrderInput | SortOrder
    address?: SortOrderInput | SortOrder
    capacity?: SortOrderInput | SortOrder
    price?: SortOrder
    pricePeriod?: SortOrder
    status?: SortOrder
    adminNotes?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    typeId?: SortOrder
    sellerId?: SortOrder
    _count?: SpaceCountOrderByAggregateInput
    _avg?: SpaceAvgOrderByAggregateInput
    _max?: SpaceMaxOrderByAggregateInput
    _min?: SpaceMinOrderByAggregateInput
    _sum?: SpaceSumOrderByAggregateInput
  }

  export type SpaceScalarWhereWithAggregatesInput = {
    AND?: SpaceScalarWhereWithAggregatesInput | SpaceScalarWhereWithAggregatesInput[]
    OR?: SpaceScalarWhereWithAggregatesInput[]
    NOT?: SpaceScalarWhereWithAggregatesInput | SpaceScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Space"> | string
    name?: StringWithAggregatesFilter<"Space"> | string
    description?: StringNullableWithAggregatesFilter<"Space"> | string | null
    city?: StringWithAggregatesFilter<"Space"> | string
    district?: StringNullableWithAggregatesFilter<"Space"> | string | null
    address?: StringNullableWithAggregatesFilter<"Space"> | string | null
    capacity?: IntNullableWithAggregatesFilter<"Space"> | number | null
    price?: FloatWithAggregatesFilter<"Space"> | number
    pricePeriod?: StringWithAggregatesFilter<"Space"> | string
    status?: EnumSpaceStatusWithAggregatesFilter<"Space"> | $Enums.SpaceStatus
    adminNotes?: StringNullableWithAggregatesFilter<"Space"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Space"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Space"> | Date | string
    typeId?: StringWithAggregatesFilter<"Space"> | string
    sellerId?: StringWithAggregatesFilter<"Space"> | string
  }

  export type SpaceImageWhereInput = {
    AND?: SpaceImageWhereInput | SpaceImageWhereInput[]
    OR?: SpaceImageWhereInput[]
    NOT?: SpaceImageWhereInput | SpaceImageWhereInput[]
    id?: StringFilter<"SpaceImage"> | string
    url?: StringFilter<"SpaceImage"> | string
    order?: IntFilter<"SpaceImage"> | number
    spaceId?: StringFilter<"SpaceImage"> | string
    space?: XOR<SpaceScalarRelationFilter, SpaceWhereInput>
  }

  export type SpaceImageOrderByWithRelationInput = {
    id?: SortOrder
    url?: SortOrder
    order?: SortOrder
    spaceId?: SortOrder
    space?: SpaceOrderByWithRelationInput
  }

  export type SpaceImageWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: SpaceImageWhereInput | SpaceImageWhereInput[]
    OR?: SpaceImageWhereInput[]
    NOT?: SpaceImageWhereInput | SpaceImageWhereInput[]
    url?: StringFilter<"SpaceImage"> | string
    order?: IntFilter<"SpaceImage"> | number
    spaceId?: StringFilter<"SpaceImage"> | string
    space?: XOR<SpaceScalarRelationFilter, SpaceWhereInput>
  }, "id">

  export type SpaceImageOrderByWithAggregationInput = {
    id?: SortOrder
    url?: SortOrder
    order?: SortOrder
    spaceId?: SortOrder
    _count?: SpaceImageCountOrderByAggregateInput
    _avg?: SpaceImageAvgOrderByAggregateInput
    _max?: SpaceImageMaxOrderByAggregateInput
    _min?: SpaceImageMinOrderByAggregateInput
    _sum?: SpaceImageSumOrderByAggregateInput
  }

  export type SpaceImageScalarWhereWithAggregatesInput = {
    AND?: SpaceImageScalarWhereWithAggregatesInput | SpaceImageScalarWhereWithAggregatesInput[]
    OR?: SpaceImageScalarWhereWithAggregatesInput[]
    NOT?: SpaceImageScalarWhereWithAggregatesInput | SpaceImageScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"SpaceImage"> | string
    url?: StringWithAggregatesFilter<"SpaceImage"> | string
    order?: IntWithAggregatesFilter<"SpaceImage"> | number
    spaceId?: StringWithAggregatesFilter<"SpaceImage"> | string
  }

  export type SpaceAmenityWhereInput = {
    AND?: SpaceAmenityWhereInput | SpaceAmenityWhereInput[]
    OR?: SpaceAmenityWhereInput[]
    NOT?: SpaceAmenityWhereInput | SpaceAmenityWhereInput[]
    spaceId?: StringFilter<"SpaceAmenity"> | string
    amenityId?: StringFilter<"SpaceAmenity"> | string
    space?: XOR<SpaceScalarRelationFilter, SpaceWhereInput>
    amenity?: XOR<AmenityScalarRelationFilter, AmenityWhereInput>
  }

  export type SpaceAmenityOrderByWithRelationInput = {
    spaceId?: SortOrder
    amenityId?: SortOrder
    space?: SpaceOrderByWithRelationInput
    amenity?: AmenityOrderByWithRelationInput
  }

  export type SpaceAmenityWhereUniqueInput = Prisma.AtLeast<{
    spaceId_amenityId?: SpaceAmenitySpaceIdAmenityIdCompoundUniqueInput
    AND?: SpaceAmenityWhereInput | SpaceAmenityWhereInput[]
    OR?: SpaceAmenityWhereInput[]
    NOT?: SpaceAmenityWhereInput | SpaceAmenityWhereInput[]
    spaceId?: StringFilter<"SpaceAmenity"> | string
    amenityId?: StringFilter<"SpaceAmenity"> | string
    space?: XOR<SpaceScalarRelationFilter, SpaceWhereInput>
    amenity?: XOR<AmenityScalarRelationFilter, AmenityWhereInput>
  }, "spaceId_amenityId">

  export type SpaceAmenityOrderByWithAggregationInput = {
    spaceId?: SortOrder
    amenityId?: SortOrder
    _count?: SpaceAmenityCountOrderByAggregateInput
    _max?: SpaceAmenityMaxOrderByAggregateInput
    _min?: SpaceAmenityMinOrderByAggregateInput
  }

  export type SpaceAmenityScalarWhereWithAggregatesInput = {
    AND?: SpaceAmenityScalarWhereWithAggregatesInput | SpaceAmenityScalarWhereWithAggregatesInput[]
    OR?: SpaceAmenityScalarWhereWithAggregatesInput[]
    NOT?: SpaceAmenityScalarWhereWithAggregatesInput | SpaceAmenityScalarWhereWithAggregatesInput[]
    spaceId?: StringWithAggregatesFilter<"SpaceAmenity"> | string
    amenityId?: StringWithAggregatesFilter<"SpaceAmenity"> | string
  }

  export type BookingWhereInput = {
    AND?: BookingWhereInput | BookingWhereInput[]
    OR?: BookingWhereInput[]
    NOT?: BookingWhereInput | BookingWhereInput[]
    id?: StringFilter<"Booking"> | string
    date?: StringFilter<"Booking"> | string
    startTime?: StringFilter<"Booking"> | string
    endTime?: StringFilter<"Booking"> | string
    persons?: IntNullableFilter<"Booking"> | number | null
    notes?: StringNullableFilter<"Booking"> | string | null
    status?: EnumBookingStatusFilter<"Booking"> | $Enums.BookingStatus
    sellerNote?: StringNullableFilter<"Booking"> | string | null
    createdAt?: DateTimeFilter<"Booking"> | Date | string
    updatedAt?: DateTimeFilter<"Booking"> | Date | string
    spaceId?: StringFilter<"Booking"> | string
    buyerId?: StringFilter<"Booking"> | string
    space?: XOR<SpaceScalarRelationFilter, SpaceWhereInput>
    buyer?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type BookingOrderByWithRelationInput = {
    id?: SortOrder
    date?: SortOrder
    startTime?: SortOrder
    endTime?: SortOrder
    persons?: SortOrderInput | SortOrder
    notes?: SortOrderInput | SortOrder
    status?: SortOrder
    sellerNote?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    spaceId?: SortOrder
    buyerId?: SortOrder
    space?: SpaceOrderByWithRelationInput
    buyer?: UserOrderByWithRelationInput
  }

  export type BookingWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: BookingWhereInput | BookingWhereInput[]
    OR?: BookingWhereInput[]
    NOT?: BookingWhereInput | BookingWhereInput[]
    date?: StringFilter<"Booking"> | string
    startTime?: StringFilter<"Booking"> | string
    endTime?: StringFilter<"Booking"> | string
    persons?: IntNullableFilter<"Booking"> | number | null
    notes?: StringNullableFilter<"Booking"> | string | null
    status?: EnumBookingStatusFilter<"Booking"> | $Enums.BookingStatus
    sellerNote?: StringNullableFilter<"Booking"> | string | null
    createdAt?: DateTimeFilter<"Booking"> | Date | string
    updatedAt?: DateTimeFilter<"Booking"> | Date | string
    spaceId?: StringFilter<"Booking"> | string
    buyerId?: StringFilter<"Booking"> | string
    space?: XOR<SpaceScalarRelationFilter, SpaceWhereInput>
    buyer?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id">

  export type BookingOrderByWithAggregationInput = {
    id?: SortOrder
    date?: SortOrder
    startTime?: SortOrder
    endTime?: SortOrder
    persons?: SortOrderInput | SortOrder
    notes?: SortOrderInput | SortOrder
    status?: SortOrder
    sellerNote?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    spaceId?: SortOrder
    buyerId?: SortOrder
    _count?: BookingCountOrderByAggregateInput
    _avg?: BookingAvgOrderByAggregateInput
    _max?: BookingMaxOrderByAggregateInput
    _min?: BookingMinOrderByAggregateInput
    _sum?: BookingSumOrderByAggregateInput
  }

  export type BookingScalarWhereWithAggregatesInput = {
    AND?: BookingScalarWhereWithAggregatesInput | BookingScalarWhereWithAggregatesInput[]
    OR?: BookingScalarWhereWithAggregatesInput[]
    NOT?: BookingScalarWhereWithAggregatesInput | BookingScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Booking"> | string
    date?: StringWithAggregatesFilter<"Booking"> | string
    startTime?: StringWithAggregatesFilter<"Booking"> | string
    endTime?: StringWithAggregatesFilter<"Booking"> | string
    persons?: IntNullableWithAggregatesFilter<"Booking"> | number | null
    notes?: StringNullableWithAggregatesFilter<"Booking"> | string | null
    status?: EnumBookingStatusWithAggregatesFilter<"Booking"> | $Enums.BookingStatus
    sellerNote?: StringNullableWithAggregatesFilter<"Booking"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Booking"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Booking"> | Date | string
    spaceId?: StringWithAggregatesFilter<"Booking"> | string
    buyerId?: StringWithAggregatesFilter<"Booking"> | string
  }

  export type UserCreateInput = {
    id?: string
    name: string
    email: string
    phone?: string | null
    password: string
    role?: $Enums.Role
    status?: $Enums.UserStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    spaces?: SpaceCreateNestedManyWithoutSellerInput
    bookings?: BookingCreateNestedManyWithoutBuyerInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    name: string
    email: string
    phone?: string | null
    password: string
    role?: $Enums.Role
    status?: $Enums.UserStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    spaces?: SpaceUncheckedCreateNestedManyWithoutSellerInput
    bookings?: BookingUncheckedCreateNestedManyWithoutBuyerInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    status?: EnumUserStatusFieldUpdateOperationsInput | $Enums.UserStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    spaces?: SpaceUpdateManyWithoutSellerNestedInput
    bookings?: BookingUpdateManyWithoutBuyerNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    status?: EnumUserStatusFieldUpdateOperationsInput | $Enums.UserStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    spaces?: SpaceUncheckedUpdateManyWithoutSellerNestedInput
    bookings?: BookingUncheckedUpdateManyWithoutBuyerNestedInput
  }

  export type UserCreateManyInput = {
    id?: string
    name: string
    email: string
    phone?: string | null
    password: string
    role?: $Enums.Role
    status?: $Enums.UserStatus
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    status?: EnumUserStatusFieldUpdateOperationsInput | $Enums.UserStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    status?: EnumUserStatusFieldUpdateOperationsInput | $Enums.UserStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SpaceTypeCreateInput = {
    id?: string
    name: string
    spaces?: SpaceCreateNestedManyWithoutTypeInput
  }

  export type SpaceTypeUncheckedCreateInput = {
    id?: string
    name: string
    spaces?: SpaceUncheckedCreateNestedManyWithoutTypeInput
  }

  export type SpaceTypeUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    spaces?: SpaceUpdateManyWithoutTypeNestedInput
  }

  export type SpaceTypeUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    spaces?: SpaceUncheckedUpdateManyWithoutTypeNestedInput
  }

  export type SpaceTypeCreateManyInput = {
    id?: string
    name: string
  }

  export type SpaceTypeUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
  }

  export type SpaceTypeUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
  }

  export type AmenityCreateInput = {
    id?: string
    name: string
    icon?: string | null
    spaces?: SpaceAmenityCreateNestedManyWithoutAmenityInput
  }

  export type AmenityUncheckedCreateInput = {
    id?: string
    name: string
    icon?: string | null
    spaces?: SpaceAmenityUncheckedCreateNestedManyWithoutAmenityInput
  }

  export type AmenityUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    icon?: NullableStringFieldUpdateOperationsInput | string | null
    spaces?: SpaceAmenityUpdateManyWithoutAmenityNestedInput
  }

  export type AmenityUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    icon?: NullableStringFieldUpdateOperationsInput | string | null
    spaces?: SpaceAmenityUncheckedUpdateManyWithoutAmenityNestedInput
  }

  export type AmenityCreateManyInput = {
    id?: string
    name: string
    icon?: string | null
  }

  export type AmenityUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    icon?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type AmenityUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    icon?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type SpaceCreateInput = {
    id?: string
    name: string
    description?: string | null
    city: string
    district?: string | null
    address?: string | null
    capacity?: number | null
    price: number
    pricePeriod?: string
    status?: $Enums.SpaceStatus
    adminNotes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    type: SpaceTypeCreateNestedOneWithoutSpacesInput
    seller: UserCreateNestedOneWithoutSpacesInput
    images?: SpaceImageCreateNestedManyWithoutSpaceInput
    amenities?: SpaceAmenityCreateNestedManyWithoutSpaceInput
    bookings?: BookingCreateNestedManyWithoutSpaceInput
  }

  export type SpaceUncheckedCreateInput = {
    id?: string
    name: string
    description?: string | null
    city: string
    district?: string | null
    address?: string | null
    capacity?: number | null
    price: number
    pricePeriod?: string
    status?: $Enums.SpaceStatus
    adminNotes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    typeId: string
    sellerId: string
    images?: SpaceImageUncheckedCreateNestedManyWithoutSpaceInput
    amenities?: SpaceAmenityUncheckedCreateNestedManyWithoutSpaceInput
    bookings?: BookingUncheckedCreateNestedManyWithoutSpaceInput
  }

  export type SpaceUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    city?: StringFieldUpdateOperationsInput | string
    district?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    capacity?: NullableIntFieldUpdateOperationsInput | number | null
    price?: FloatFieldUpdateOperationsInput | number
    pricePeriod?: StringFieldUpdateOperationsInput | string
    status?: EnumSpaceStatusFieldUpdateOperationsInput | $Enums.SpaceStatus
    adminNotes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    type?: SpaceTypeUpdateOneRequiredWithoutSpacesNestedInput
    seller?: UserUpdateOneRequiredWithoutSpacesNestedInput
    images?: SpaceImageUpdateManyWithoutSpaceNestedInput
    amenities?: SpaceAmenityUpdateManyWithoutSpaceNestedInput
    bookings?: BookingUpdateManyWithoutSpaceNestedInput
  }

  export type SpaceUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    city?: StringFieldUpdateOperationsInput | string
    district?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    capacity?: NullableIntFieldUpdateOperationsInput | number | null
    price?: FloatFieldUpdateOperationsInput | number
    pricePeriod?: StringFieldUpdateOperationsInput | string
    status?: EnumSpaceStatusFieldUpdateOperationsInput | $Enums.SpaceStatus
    adminNotes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    typeId?: StringFieldUpdateOperationsInput | string
    sellerId?: StringFieldUpdateOperationsInput | string
    images?: SpaceImageUncheckedUpdateManyWithoutSpaceNestedInput
    amenities?: SpaceAmenityUncheckedUpdateManyWithoutSpaceNestedInput
    bookings?: BookingUncheckedUpdateManyWithoutSpaceNestedInput
  }

  export type SpaceCreateManyInput = {
    id?: string
    name: string
    description?: string | null
    city: string
    district?: string | null
    address?: string | null
    capacity?: number | null
    price: number
    pricePeriod?: string
    status?: $Enums.SpaceStatus
    adminNotes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    typeId: string
    sellerId: string
  }

  export type SpaceUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    city?: StringFieldUpdateOperationsInput | string
    district?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    capacity?: NullableIntFieldUpdateOperationsInput | number | null
    price?: FloatFieldUpdateOperationsInput | number
    pricePeriod?: StringFieldUpdateOperationsInput | string
    status?: EnumSpaceStatusFieldUpdateOperationsInput | $Enums.SpaceStatus
    adminNotes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SpaceUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    city?: StringFieldUpdateOperationsInput | string
    district?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    capacity?: NullableIntFieldUpdateOperationsInput | number | null
    price?: FloatFieldUpdateOperationsInput | number
    pricePeriod?: StringFieldUpdateOperationsInput | string
    status?: EnumSpaceStatusFieldUpdateOperationsInput | $Enums.SpaceStatus
    adminNotes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    typeId?: StringFieldUpdateOperationsInput | string
    sellerId?: StringFieldUpdateOperationsInput | string
  }

  export type SpaceImageCreateInput = {
    id?: string
    url: string
    order?: number
    space: SpaceCreateNestedOneWithoutImagesInput
  }

  export type SpaceImageUncheckedCreateInput = {
    id?: string
    url: string
    order?: number
    spaceId: string
  }

  export type SpaceImageUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
    space?: SpaceUpdateOneRequiredWithoutImagesNestedInput
  }

  export type SpaceImageUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
    spaceId?: StringFieldUpdateOperationsInput | string
  }

  export type SpaceImageCreateManyInput = {
    id?: string
    url: string
    order?: number
    spaceId: string
  }

  export type SpaceImageUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
  }

  export type SpaceImageUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
    spaceId?: StringFieldUpdateOperationsInput | string
  }

  export type SpaceAmenityCreateInput = {
    space: SpaceCreateNestedOneWithoutAmenitiesInput
    amenity: AmenityCreateNestedOneWithoutSpacesInput
  }

  export type SpaceAmenityUncheckedCreateInput = {
    spaceId: string
    amenityId: string
  }

  export type SpaceAmenityUpdateInput = {
    space?: SpaceUpdateOneRequiredWithoutAmenitiesNestedInput
    amenity?: AmenityUpdateOneRequiredWithoutSpacesNestedInput
  }

  export type SpaceAmenityUncheckedUpdateInput = {
    spaceId?: StringFieldUpdateOperationsInput | string
    amenityId?: StringFieldUpdateOperationsInput | string
  }

  export type SpaceAmenityCreateManyInput = {
    spaceId: string
    amenityId: string
  }

  export type SpaceAmenityUpdateManyMutationInput = {

  }

  export type SpaceAmenityUncheckedUpdateManyInput = {
    spaceId?: StringFieldUpdateOperationsInput | string
    amenityId?: StringFieldUpdateOperationsInput | string
  }

  export type BookingCreateInput = {
    id?: string
    date: string
    startTime: string
    endTime: string
    persons?: number | null
    notes?: string | null
    status?: $Enums.BookingStatus
    sellerNote?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    space: SpaceCreateNestedOneWithoutBookingsInput
    buyer: UserCreateNestedOneWithoutBookingsInput
  }

  export type BookingUncheckedCreateInput = {
    id?: string
    date: string
    startTime: string
    endTime: string
    persons?: number | null
    notes?: string | null
    status?: $Enums.BookingStatus
    sellerNote?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    spaceId: string
    buyerId: string
  }

  export type BookingUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: StringFieldUpdateOperationsInput | string
    startTime?: StringFieldUpdateOperationsInput | string
    endTime?: StringFieldUpdateOperationsInput | string
    persons?: NullableIntFieldUpdateOperationsInput | number | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumBookingStatusFieldUpdateOperationsInput | $Enums.BookingStatus
    sellerNote?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    space?: SpaceUpdateOneRequiredWithoutBookingsNestedInput
    buyer?: UserUpdateOneRequiredWithoutBookingsNestedInput
  }

  export type BookingUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: StringFieldUpdateOperationsInput | string
    startTime?: StringFieldUpdateOperationsInput | string
    endTime?: StringFieldUpdateOperationsInput | string
    persons?: NullableIntFieldUpdateOperationsInput | number | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumBookingStatusFieldUpdateOperationsInput | $Enums.BookingStatus
    sellerNote?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    spaceId?: StringFieldUpdateOperationsInput | string
    buyerId?: StringFieldUpdateOperationsInput | string
  }

  export type BookingCreateManyInput = {
    id?: string
    date: string
    startTime: string
    endTime: string
    persons?: number | null
    notes?: string | null
    status?: $Enums.BookingStatus
    sellerNote?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    spaceId: string
    buyerId: string
  }

  export type BookingUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: StringFieldUpdateOperationsInput | string
    startTime?: StringFieldUpdateOperationsInput | string
    endTime?: StringFieldUpdateOperationsInput | string
    persons?: NullableIntFieldUpdateOperationsInput | number | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumBookingStatusFieldUpdateOperationsInput | $Enums.BookingStatus
    sellerNote?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BookingUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: StringFieldUpdateOperationsInput | string
    startTime?: StringFieldUpdateOperationsInput | string
    endTime?: StringFieldUpdateOperationsInput | string
    persons?: NullableIntFieldUpdateOperationsInput | number | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumBookingStatusFieldUpdateOperationsInput | $Enums.BookingStatus
    sellerNote?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    spaceId?: StringFieldUpdateOperationsInput | string
    buyerId?: StringFieldUpdateOperationsInput | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type EnumRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumRoleFilter<$PrismaModel> | $Enums.Role
  }

  export type EnumUserStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.UserStatus | EnumUserStatusFieldRefInput<$PrismaModel>
    in?: $Enums.UserStatus[] | ListEnumUserStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserStatus[] | ListEnumUserStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumUserStatusFilter<$PrismaModel> | $Enums.UserStatus
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type SpaceListRelationFilter = {
    every?: SpaceWhereInput
    some?: SpaceWhereInput
    none?: SpaceWhereInput
  }

  export type BookingListRelationFilter = {
    every?: BookingWhereInput
    some?: BookingWhereInput
    none?: BookingWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type SpaceOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type BookingOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    password?: SortOrder
    role?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    password?: SortOrder
    role?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    password?: SortOrder
    role?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type EnumRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumRoleWithAggregatesFilter<$PrismaModel> | $Enums.Role
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumRoleFilter<$PrismaModel>
    _max?: NestedEnumRoleFilter<$PrismaModel>
  }

  export type EnumUserStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.UserStatus | EnumUserStatusFieldRefInput<$PrismaModel>
    in?: $Enums.UserStatus[] | ListEnumUserStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserStatus[] | ListEnumUserStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumUserStatusWithAggregatesFilter<$PrismaModel> | $Enums.UserStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumUserStatusFilter<$PrismaModel>
    _max?: NestedEnumUserStatusFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type SpaceTypeCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
  }

  export type SpaceTypeMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
  }

  export type SpaceTypeMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
  }

  export type SpaceAmenityListRelationFilter = {
    every?: SpaceAmenityWhereInput
    some?: SpaceAmenityWhereInput
    none?: SpaceAmenityWhereInput
  }

  export type SpaceAmenityOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type AmenityCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    icon?: SortOrder
  }

  export type AmenityMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    icon?: SortOrder
  }

  export type AmenityMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    icon?: SortOrder
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type FloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type EnumSpaceStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.SpaceStatus | EnumSpaceStatusFieldRefInput<$PrismaModel>
    in?: $Enums.SpaceStatus[] | ListEnumSpaceStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.SpaceStatus[] | ListEnumSpaceStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumSpaceStatusFilter<$PrismaModel> | $Enums.SpaceStatus
  }

  export type SpaceTypeScalarRelationFilter = {
    is?: SpaceTypeWhereInput
    isNot?: SpaceTypeWhereInput
  }

  export type UserScalarRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type SpaceImageListRelationFilter = {
    every?: SpaceImageWhereInput
    some?: SpaceImageWhereInput
    none?: SpaceImageWhereInput
  }

  export type SpaceImageOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type SpaceCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    city?: SortOrder
    district?: SortOrder
    address?: SortOrder
    capacity?: SortOrder
    price?: SortOrder
    pricePeriod?: SortOrder
    status?: SortOrder
    adminNotes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    typeId?: SortOrder
    sellerId?: SortOrder
  }

  export type SpaceAvgOrderByAggregateInput = {
    capacity?: SortOrder
    price?: SortOrder
  }

  export type SpaceMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    city?: SortOrder
    district?: SortOrder
    address?: SortOrder
    capacity?: SortOrder
    price?: SortOrder
    pricePeriod?: SortOrder
    status?: SortOrder
    adminNotes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    typeId?: SortOrder
    sellerId?: SortOrder
  }

  export type SpaceMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    city?: SortOrder
    district?: SortOrder
    address?: SortOrder
    capacity?: SortOrder
    price?: SortOrder
    pricePeriod?: SortOrder
    status?: SortOrder
    adminNotes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    typeId?: SortOrder
    sellerId?: SortOrder
  }

  export type SpaceSumOrderByAggregateInput = {
    capacity?: SortOrder
    price?: SortOrder
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type FloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type EnumSpaceStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.SpaceStatus | EnumSpaceStatusFieldRefInput<$PrismaModel>
    in?: $Enums.SpaceStatus[] | ListEnumSpaceStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.SpaceStatus[] | ListEnumSpaceStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumSpaceStatusWithAggregatesFilter<$PrismaModel> | $Enums.SpaceStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumSpaceStatusFilter<$PrismaModel>
    _max?: NestedEnumSpaceStatusFilter<$PrismaModel>
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type SpaceScalarRelationFilter = {
    is?: SpaceWhereInput
    isNot?: SpaceWhereInput
  }

  export type SpaceImageCountOrderByAggregateInput = {
    id?: SortOrder
    url?: SortOrder
    order?: SortOrder
    spaceId?: SortOrder
  }

  export type SpaceImageAvgOrderByAggregateInput = {
    order?: SortOrder
  }

  export type SpaceImageMaxOrderByAggregateInput = {
    id?: SortOrder
    url?: SortOrder
    order?: SortOrder
    spaceId?: SortOrder
  }

  export type SpaceImageMinOrderByAggregateInput = {
    id?: SortOrder
    url?: SortOrder
    order?: SortOrder
    spaceId?: SortOrder
  }

  export type SpaceImageSumOrderByAggregateInput = {
    order?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type AmenityScalarRelationFilter = {
    is?: AmenityWhereInput
    isNot?: AmenityWhereInput
  }

  export type SpaceAmenitySpaceIdAmenityIdCompoundUniqueInput = {
    spaceId: string
    amenityId: string
  }

  export type SpaceAmenityCountOrderByAggregateInput = {
    spaceId?: SortOrder
    amenityId?: SortOrder
  }

  export type SpaceAmenityMaxOrderByAggregateInput = {
    spaceId?: SortOrder
    amenityId?: SortOrder
  }

  export type SpaceAmenityMinOrderByAggregateInput = {
    spaceId?: SortOrder
    amenityId?: SortOrder
  }

  export type EnumBookingStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.BookingStatus | EnumBookingStatusFieldRefInput<$PrismaModel>
    in?: $Enums.BookingStatus[] | ListEnumBookingStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.BookingStatus[] | ListEnumBookingStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumBookingStatusFilter<$PrismaModel> | $Enums.BookingStatus
  }

  export type BookingCountOrderByAggregateInput = {
    id?: SortOrder
    date?: SortOrder
    startTime?: SortOrder
    endTime?: SortOrder
    persons?: SortOrder
    notes?: SortOrder
    status?: SortOrder
    sellerNote?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    spaceId?: SortOrder
    buyerId?: SortOrder
  }

  export type BookingAvgOrderByAggregateInput = {
    persons?: SortOrder
  }

  export type BookingMaxOrderByAggregateInput = {
    id?: SortOrder
    date?: SortOrder
    startTime?: SortOrder
    endTime?: SortOrder
    persons?: SortOrder
    notes?: SortOrder
    status?: SortOrder
    sellerNote?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    spaceId?: SortOrder
    buyerId?: SortOrder
  }

  export type BookingMinOrderByAggregateInput = {
    id?: SortOrder
    date?: SortOrder
    startTime?: SortOrder
    endTime?: SortOrder
    persons?: SortOrder
    notes?: SortOrder
    status?: SortOrder
    sellerNote?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    spaceId?: SortOrder
    buyerId?: SortOrder
  }

  export type BookingSumOrderByAggregateInput = {
    persons?: SortOrder
  }

  export type EnumBookingStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.BookingStatus | EnumBookingStatusFieldRefInput<$PrismaModel>
    in?: $Enums.BookingStatus[] | ListEnumBookingStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.BookingStatus[] | ListEnumBookingStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumBookingStatusWithAggregatesFilter<$PrismaModel> | $Enums.BookingStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumBookingStatusFilter<$PrismaModel>
    _max?: NestedEnumBookingStatusFilter<$PrismaModel>
  }

  export type SpaceCreateNestedManyWithoutSellerInput = {
    create?: XOR<SpaceCreateWithoutSellerInput, SpaceUncheckedCreateWithoutSellerInput> | SpaceCreateWithoutSellerInput[] | SpaceUncheckedCreateWithoutSellerInput[]
    connectOrCreate?: SpaceCreateOrConnectWithoutSellerInput | SpaceCreateOrConnectWithoutSellerInput[]
    createMany?: SpaceCreateManySellerInputEnvelope
    connect?: SpaceWhereUniqueInput | SpaceWhereUniqueInput[]
  }

  export type BookingCreateNestedManyWithoutBuyerInput = {
    create?: XOR<BookingCreateWithoutBuyerInput, BookingUncheckedCreateWithoutBuyerInput> | BookingCreateWithoutBuyerInput[] | BookingUncheckedCreateWithoutBuyerInput[]
    connectOrCreate?: BookingCreateOrConnectWithoutBuyerInput | BookingCreateOrConnectWithoutBuyerInput[]
    createMany?: BookingCreateManyBuyerInputEnvelope
    connect?: BookingWhereUniqueInput | BookingWhereUniqueInput[]
  }

  export type SpaceUncheckedCreateNestedManyWithoutSellerInput = {
    create?: XOR<SpaceCreateWithoutSellerInput, SpaceUncheckedCreateWithoutSellerInput> | SpaceCreateWithoutSellerInput[] | SpaceUncheckedCreateWithoutSellerInput[]
    connectOrCreate?: SpaceCreateOrConnectWithoutSellerInput | SpaceCreateOrConnectWithoutSellerInput[]
    createMany?: SpaceCreateManySellerInputEnvelope
    connect?: SpaceWhereUniqueInput | SpaceWhereUniqueInput[]
  }

  export type BookingUncheckedCreateNestedManyWithoutBuyerInput = {
    create?: XOR<BookingCreateWithoutBuyerInput, BookingUncheckedCreateWithoutBuyerInput> | BookingCreateWithoutBuyerInput[] | BookingUncheckedCreateWithoutBuyerInput[]
    connectOrCreate?: BookingCreateOrConnectWithoutBuyerInput | BookingCreateOrConnectWithoutBuyerInput[]
    createMany?: BookingCreateManyBuyerInputEnvelope
    connect?: BookingWhereUniqueInput | BookingWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type EnumRoleFieldUpdateOperationsInput = {
    set?: $Enums.Role
  }

  export type EnumUserStatusFieldUpdateOperationsInput = {
    set?: $Enums.UserStatus
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type SpaceUpdateManyWithoutSellerNestedInput = {
    create?: XOR<SpaceCreateWithoutSellerInput, SpaceUncheckedCreateWithoutSellerInput> | SpaceCreateWithoutSellerInput[] | SpaceUncheckedCreateWithoutSellerInput[]
    connectOrCreate?: SpaceCreateOrConnectWithoutSellerInput | SpaceCreateOrConnectWithoutSellerInput[]
    upsert?: SpaceUpsertWithWhereUniqueWithoutSellerInput | SpaceUpsertWithWhereUniqueWithoutSellerInput[]
    createMany?: SpaceCreateManySellerInputEnvelope
    set?: SpaceWhereUniqueInput | SpaceWhereUniqueInput[]
    disconnect?: SpaceWhereUniqueInput | SpaceWhereUniqueInput[]
    delete?: SpaceWhereUniqueInput | SpaceWhereUniqueInput[]
    connect?: SpaceWhereUniqueInput | SpaceWhereUniqueInput[]
    update?: SpaceUpdateWithWhereUniqueWithoutSellerInput | SpaceUpdateWithWhereUniqueWithoutSellerInput[]
    updateMany?: SpaceUpdateManyWithWhereWithoutSellerInput | SpaceUpdateManyWithWhereWithoutSellerInput[]
    deleteMany?: SpaceScalarWhereInput | SpaceScalarWhereInput[]
  }

  export type BookingUpdateManyWithoutBuyerNestedInput = {
    create?: XOR<BookingCreateWithoutBuyerInput, BookingUncheckedCreateWithoutBuyerInput> | BookingCreateWithoutBuyerInput[] | BookingUncheckedCreateWithoutBuyerInput[]
    connectOrCreate?: BookingCreateOrConnectWithoutBuyerInput | BookingCreateOrConnectWithoutBuyerInput[]
    upsert?: BookingUpsertWithWhereUniqueWithoutBuyerInput | BookingUpsertWithWhereUniqueWithoutBuyerInput[]
    createMany?: BookingCreateManyBuyerInputEnvelope
    set?: BookingWhereUniqueInput | BookingWhereUniqueInput[]
    disconnect?: BookingWhereUniqueInput | BookingWhereUniqueInput[]
    delete?: BookingWhereUniqueInput | BookingWhereUniqueInput[]
    connect?: BookingWhereUniqueInput | BookingWhereUniqueInput[]
    update?: BookingUpdateWithWhereUniqueWithoutBuyerInput | BookingUpdateWithWhereUniqueWithoutBuyerInput[]
    updateMany?: BookingUpdateManyWithWhereWithoutBuyerInput | BookingUpdateManyWithWhereWithoutBuyerInput[]
    deleteMany?: BookingScalarWhereInput | BookingScalarWhereInput[]
  }

  export type SpaceUncheckedUpdateManyWithoutSellerNestedInput = {
    create?: XOR<SpaceCreateWithoutSellerInput, SpaceUncheckedCreateWithoutSellerInput> | SpaceCreateWithoutSellerInput[] | SpaceUncheckedCreateWithoutSellerInput[]
    connectOrCreate?: SpaceCreateOrConnectWithoutSellerInput | SpaceCreateOrConnectWithoutSellerInput[]
    upsert?: SpaceUpsertWithWhereUniqueWithoutSellerInput | SpaceUpsertWithWhereUniqueWithoutSellerInput[]
    createMany?: SpaceCreateManySellerInputEnvelope
    set?: SpaceWhereUniqueInput | SpaceWhereUniqueInput[]
    disconnect?: SpaceWhereUniqueInput | SpaceWhereUniqueInput[]
    delete?: SpaceWhereUniqueInput | SpaceWhereUniqueInput[]
    connect?: SpaceWhereUniqueInput | SpaceWhereUniqueInput[]
    update?: SpaceUpdateWithWhereUniqueWithoutSellerInput | SpaceUpdateWithWhereUniqueWithoutSellerInput[]
    updateMany?: SpaceUpdateManyWithWhereWithoutSellerInput | SpaceUpdateManyWithWhereWithoutSellerInput[]
    deleteMany?: SpaceScalarWhereInput | SpaceScalarWhereInput[]
  }

  export type BookingUncheckedUpdateManyWithoutBuyerNestedInput = {
    create?: XOR<BookingCreateWithoutBuyerInput, BookingUncheckedCreateWithoutBuyerInput> | BookingCreateWithoutBuyerInput[] | BookingUncheckedCreateWithoutBuyerInput[]
    connectOrCreate?: BookingCreateOrConnectWithoutBuyerInput | BookingCreateOrConnectWithoutBuyerInput[]
    upsert?: BookingUpsertWithWhereUniqueWithoutBuyerInput | BookingUpsertWithWhereUniqueWithoutBuyerInput[]
    createMany?: BookingCreateManyBuyerInputEnvelope
    set?: BookingWhereUniqueInput | BookingWhereUniqueInput[]
    disconnect?: BookingWhereUniqueInput | BookingWhereUniqueInput[]
    delete?: BookingWhereUniqueInput | BookingWhereUniqueInput[]
    connect?: BookingWhereUniqueInput | BookingWhereUniqueInput[]
    update?: BookingUpdateWithWhereUniqueWithoutBuyerInput | BookingUpdateWithWhereUniqueWithoutBuyerInput[]
    updateMany?: BookingUpdateManyWithWhereWithoutBuyerInput | BookingUpdateManyWithWhereWithoutBuyerInput[]
    deleteMany?: BookingScalarWhereInput | BookingScalarWhereInput[]
  }

  export type SpaceCreateNestedManyWithoutTypeInput = {
    create?: XOR<SpaceCreateWithoutTypeInput, SpaceUncheckedCreateWithoutTypeInput> | SpaceCreateWithoutTypeInput[] | SpaceUncheckedCreateWithoutTypeInput[]
    connectOrCreate?: SpaceCreateOrConnectWithoutTypeInput | SpaceCreateOrConnectWithoutTypeInput[]
    createMany?: SpaceCreateManyTypeInputEnvelope
    connect?: SpaceWhereUniqueInput | SpaceWhereUniqueInput[]
  }

  export type SpaceUncheckedCreateNestedManyWithoutTypeInput = {
    create?: XOR<SpaceCreateWithoutTypeInput, SpaceUncheckedCreateWithoutTypeInput> | SpaceCreateWithoutTypeInput[] | SpaceUncheckedCreateWithoutTypeInput[]
    connectOrCreate?: SpaceCreateOrConnectWithoutTypeInput | SpaceCreateOrConnectWithoutTypeInput[]
    createMany?: SpaceCreateManyTypeInputEnvelope
    connect?: SpaceWhereUniqueInput | SpaceWhereUniqueInput[]
  }

  export type SpaceUpdateManyWithoutTypeNestedInput = {
    create?: XOR<SpaceCreateWithoutTypeInput, SpaceUncheckedCreateWithoutTypeInput> | SpaceCreateWithoutTypeInput[] | SpaceUncheckedCreateWithoutTypeInput[]
    connectOrCreate?: SpaceCreateOrConnectWithoutTypeInput | SpaceCreateOrConnectWithoutTypeInput[]
    upsert?: SpaceUpsertWithWhereUniqueWithoutTypeInput | SpaceUpsertWithWhereUniqueWithoutTypeInput[]
    createMany?: SpaceCreateManyTypeInputEnvelope
    set?: SpaceWhereUniqueInput | SpaceWhereUniqueInput[]
    disconnect?: SpaceWhereUniqueInput | SpaceWhereUniqueInput[]
    delete?: SpaceWhereUniqueInput | SpaceWhereUniqueInput[]
    connect?: SpaceWhereUniqueInput | SpaceWhereUniqueInput[]
    update?: SpaceUpdateWithWhereUniqueWithoutTypeInput | SpaceUpdateWithWhereUniqueWithoutTypeInput[]
    updateMany?: SpaceUpdateManyWithWhereWithoutTypeInput | SpaceUpdateManyWithWhereWithoutTypeInput[]
    deleteMany?: SpaceScalarWhereInput | SpaceScalarWhereInput[]
  }

  export type SpaceUncheckedUpdateManyWithoutTypeNestedInput = {
    create?: XOR<SpaceCreateWithoutTypeInput, SpaceUncheckedCreateWithoutTypeInput> | SpaceCreateWithoutTypeInput[] | SpaceUncheckedCreateWithoutTypeInput[]
    connectOrCreate?: SpaceCreateOrConnectWithoutTypeInput | SpaceCreateOrConnectWithoutTypeInput[]
    upsert?: SpaceUpsertWithWhereUniqueWithoutTypeInput | SpaceUpsertWithWhereUniqueWithoutTypeInput[]
    createMany?: SpaceCreateManyTypeInputEnvelope
    set?: SpaceWhereUniqueInput | SpaceWhereUniqueInput[]
    disconnect?: SpaceWhereUniqueInput | SpaceWhereUniqueInput[]
    delete?: SpaceWhereUniqueInput | SpaceWhereUniqueInput[]
    connect?: SpaceWhereUniqueInput | SpaceWhereUniqueInput[]
    update?: SpaceUpdateWithWhereUniqueWithoutTypeInput | SpaceUpdateWithWhereUniqueWithoutTypeInput[]
    updateMany?: SpaceUpdateManyWithWhereWithoutTypeInput | SpaceUpdateManyWithWhereWithoutTypeInput[]
    deleteMany?: SpaceScalarWhereInput | SpaceScalarWhereInput[]
  }

  export type SpaceAmenityCreateNestedManyWithoutAmenityInput = {
    create?: XOR<SpaceAmenityCreateWithoutAmenityInput, SpaceAmenityUncheckedCreateWithoutAmenityInput> | SpaceAmenityCreateWithoutAmenityInput[] | SpaceAmenityUncheckedCreateWithoutAmenityInput[]
    connectOrCreate?: SpaceAmenityCreateOrConnectWithoutAmenityInput | SpaceAmenityCreateOrConnectWithoutAmenityInput[]
    createMany?: SpaceAmenityCreateManyAmenityInputEnvelope
    connect?: SpaceAmenityWhereUniqueInput | SpaceAmenityWhereUniqueInput[]
  }

  export type SpaceAmenityUncheckedCreateNestedManyWithoutAmenityInput = {
    create?: XOR<SpaceAmenityCreateWithoutAmenityInput, SpaceAmenityUncheckedCreateWithoutAmenityInput> | SpaceAmenityCreateWithoutAmenityInput[] | SpaceAmenityUncheckedCreateWithoutAmenityInput[]
    connectOrCreate?: SpaceAmenityCreateOrConnectWithoutAmenityInput | SpaceAmenityCreateOrConnectWithoutAmenityInput[]
    createMany?: SpaceAmenityCreateManyAmenityInputEnvelope
    connect?: SpaceAmenityWhereUniqueInput | SpaceAmenityWhereUniqueInput[]
  }

  export type SpaceAmenityUpdateManyWithoutAmenityNestedInput = {
    create?: XOR<SpaceAmenityCreateWithoutAmenityInput, SpaceAmenityUncheckedCreateWithoutAmenityInput> | SpaceAmenityCreateWithoutAmenityInput[] | SpaceAmenityUncheckedCreateWithoutAmenityInput[]
    connectOrCreate?: SpaceAmenityCreateOrConnectWithoutAmenityInput | SpaceAmenityCreateOrConnectWithoutAmenityInput[]
    upsert?: SpaceAmenityUpsertWithWhereUniqueWithoutAmenityInput | SpaceAmenityUpsertWithWhereUniqueWithoutAmenityInput[]
    createMany?: SpaceAmenityCreateManyAmenityInputEnvelope
    set?: SpaceAmenityWhereUniqueInput | SpaceAmenityWhereUniqueInput[]
    disconnect?: SpaceAmenityWhereUniqueInput | SpaceAmenityWhereUniqueInput[]
    delete?: SpaceAmenityWhereUniqueInput | SpaceAmenityWhereUniqueInput[]
    connect?: SpaceAmenityWhereUniqueInput | SpaceAmenityWhereUniqueInput[]
    update?: SpaceAmenityUpdateWithWhereUniqueWithoutAmenityInput | SpaceAmenityUpdateWithWhereUniqueWithoutAmenityInput[]
    updateMany?: SpaceAmenityUpdateManyWithWhereWithoutAmenityInput | SpaceAmenityUpdateManyWithWhereWithoutAmenityInput[]
    deleteMany?: SpaceAmenityScalarWhereInput | SpaceAmenityScalarWhereInput[]
  }

  export type SpaceAmenityUncheckedUpdateManyWithoutAmenityNestedInput = {
    create?: XOR<SpaceAmenityCreateWithoutAmenityInput, SpaceAmenityUncheckedCreateWithoutAmenityInput> | SpaceAmenityCreateWithoutAmenityInput[] | SpaceAmenityUncheckedCreateWithoutAmenityInput[]
    connectOrCreate?: SpaceAmenityCreateOrConnectWithoutAmenityInput | SpaceAmenityCreateOrConnectWithoutAmenityInput[]
    upsert?: SpaceAmenityUpsertWithWhereUniqueWithoutAmenityInput | SpaceAmenityUpsertWithWhereUniqueWithoutAmenityInput[]
    createMany?: SpaceAmenityCreateManyAmenityInputEnvelope
    set?: SpaceAmenityWhereUniqueInput | SpaceAmenityWhereUniqueInput[]
    disconnect?: SpaceAmenityWhereUniqueInput | SpaceAmenityWhereUniqueInput[]
    delete?: SpaceAmenityWhereUniqueInput | SpaceAmenityWhereUniqueInput[]
    connect?: SpaceAmenityWhereUniqueInput | SpaceAmenityWhereUniqueInput[]
    update?: SpaceAmenityUpdateWithWhereUniqueWithoutAmenityInput | SpaceAmenityUpdateWithWhereUniqueWithoutAmenityInput[]
    updateMany?: SpaceAmenityUpdateManyWithWhereWithoutAmenityInput | SpaceAmenityUpdateManyWithWhereWithoutAmenityInput[]
    deleteMany?: SpaceAmenityScalarWhereInput | SpaceAmenityScalarWhereInput[]
  }

  export type SpaceTypeCreateNestedOneWithoutSpacesInput = {
    create?: XOR<SpaceTypeCreateWithoutSpacesInput, SpaceTypeUncheckedCreateWithoutSpacesInput>
    connectOrCreate?: SpaceTypeCreateOrConnectWithoutSpacesInput
    connect?: SpaceTypeWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutSpacesInput = {
    create?: XOR<UserCreateWithoutSpacesInput, UserUncheckedCreateWithoutSpacesInput>
    connectOrCreate?: UserCreateOrConnectWithoutSpacesInput
    connect?: UserWhereUniqueInput
  }

  export type SpaceImageCreateNestedManyWithoutSpaceInput = {
    create?: XOR<SpaceImageCreateWithoutSpaceInput, SpaceImageUncheckedCreateWithoutSpaceInput> | SpaceImageCreateWithoutSpaceInput[] | SpaceImageUncheckedCreateWithoutSpaceInput[]
    connectOrCreate?: SpaceImageCreateOrConnectWithoutSpaceInput | SpaceImageCreateOrConnectWithoutSpaceInput[]
    createMany?: SpaceImageCreateManySpaceInputEnvelope
    connect?: SpaceImageWhereUniqueInput | SpaceImageWhereUniqueInput[]
  }

  export type SpaceAmenityCreateNestedManyWithoutSpaceInput = {
    create?: XOR<SpaceAmenityCreateWithoutSpaceInput, SpaceAmenityUncheckedCreateWithoutSpaceInput> | SpaceAmenityCreateWithoutSpaceInput[] | SpaceAmenityUncheckedCreateWithoutSpaceInput[]
    connectOrCreate?: SpaceAmenityCreateOrConnectWithoutSpaceInput | SpaceAmenityCreateOrConnectWithoutSpaceInput[]
    createMany?: SpaceAmenityCreateManySpaceInputEnvelope
    connect?: SpaceAmenityWhereUniqueInput | SpaceAmenityWhereUniqueInput[]
  }

  export type BookingCreateNestedManyWithoutSpaceInput = {
    create?: XOR<BookingCreateWithoutSpaceInput, BookingUncheckedCreateWithoutSpaceInput> | BookingCreateWithoutSpaceInput[] | BookingUncheckedCreateWithoutSpaceInput[]
    connectOrCreate?: BookingCreateOrConnectWithoutSpaceInput | BookingCreateOrConnectWithoutSpaceInput[]
    createMany?: BookingCreateManySpaceInputEnvelope
    connect?: BookingWhereUniqueInput | BookingWhereUniqueInput[]
  }

  export type SpaceImageUncheckedCreateNestedManyWithoutSpaceInput = {
    create?: XOR<SpaceImageCreateWithoutSpaceInput, SpaceImageUncheckedCreateWithoutSpaceInput> | SpaceImageCreateWithoutSpaceInput[] | SpaceImageUncheckedCreateWithoutSpaceInput[]
    connectOrCreate?: SpaceImageCreateOrConnectWithoutSpaceInput | SpaceImageCreateOrConnectWithoutSpaceInput[]
    createMany?: SpaceImageCreateManySpaceInputEnvelope
    connect?: SpaceImageWhereUniqueInput | SpaceImageWhereUniqueInput[]
  }

  export type SpaceAmenityUncheckedCreateNestedManyWithoutSpaceInput = {
    create?: XOR<SpaceAmenityCreateWithoutSpaceInput, SpaceAmenityUncheckedCreateWithoutSpaceInput> | SpaceAmenityCreateWithoutSpaceInput[] | SpaceAmenityUncheckedCreateWithoutSpaceInput[]
    connectOrCreate?: SpaceAmenityCreateOrConnectWithoutSpaceInput | SpaceAmenityCreateOrConnectWithoutSpaceInput[]
    createMany?: SpaceAmenityCreateManySpaceInputEnvelope
    connect?: SpaceAmenityWhereUniqueInput | SpaceAmenityWhereUniqueInput[]
  }

  export type BookingUncheckedCreateNestedManyWithoutSpaceInput = {
    create?: XOR<BookingCreateWithoutSpaceInput, BookingUncheckedCreateWithoutSpaceInput> | BookingCreateWithoutSpaceInput[] | BookingUncheckedCreateWithoutSpaceInput[]
    connectOrCreate?: BookingCreateOrConnectWithoutSpaceInput | BookingCreateOrConnectWithoutSpaceInput[]
    createMany?: BookingCreateManySpaceInputEnvelope
    connect?: BookingWhereUniqueInput | BookingWhereUniqueInput[]
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type FloatFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type EnumSpaceStatusFieldUpdateOperationsInput = {
    set?: $Enums.SpaceStatus
  }

  export type SpaceTypeUpdateOneRequiredWithoutSpacesNestedInput = {
    create?: XOR<SpaceTypeCreateWithoutSpacesInput, SpaceTypeUncheckedCreateWithoutSpacesInput>
    connectOrCreate?: SpaceTypeCreateOrConnectWithoutSpacesInput
    upsert?: SpaceTypeUpsertWithoutSpacesInput
    connect?: SpaceTypeWhereUniqueInput
    update?: XOR<XOR<SpaceTypeUpdateToOneWithWhereWithoutSpacesInput, SpaceTypeUpdateWithoutSpacesInput>, SpaceTypeUncheckedUpdateWithoutSpacesInput>
  }

  export type UserUpdateOneRequiredWithoutSpacesNestedInput = {
    create?: XOR<UserCreateWithoutSpacesInput, UserUncheckedCreateWithoutSpacesInput>
    connectOrCreate?: UserCreateOrConnectWithoutSpacesInput
    upsert?: UserUpsertWithoutSpacesInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutSpacesInput, UserUpdateWithoutSpacesInput>, UserUncheckedUpdateWithoutSpacesInput>
  }

  export type SpaceImageUpdateManyWithoutSpaceNestedInput = {
    create?: XOR<SpaceImageCreateWithoutSpaceInput, SpaceImageUncheckedCreateWithoutSpaceInput> | SpaceImageCreateWithoutSpaceInput[] | SpaceImageUncheckedCreateWithoutSpaceInput[]
    connectOrCreate?: SpaceImageCreateOrConnectWithoutSpaceInput | SpaceImageCreateOrConnectWithoutSpaceInput[]
    upsert?: SpaceImageUpsertWithWhereUniqueWithoutSpaceInput | SpaceImageUpsertWithWhereUniqueWithoutSpaceInput[]
    createMany?: SpaceImageCreateManySpaceInputEnvelope
    set?: SpaceImageWhereUniqueInput | SpaceImageWhereUniqueInput[]
    disconnect?: SpaceImageWhereUniqueInput | SpaceImageWhereUniqueInput[]
    delete?: SpaceImageWhereUniqueInput | SpaceImageWhereUniqueInput[]
    connect?: SpaceImageWhereUniqueInput | SpaceImageWhereUniqueInput[]
    update?: SpaceImageUpdateWithWhereUniqueWithoutSpaceInput | SpaceImageUpdateWithWhereUniqueWithoutSpaceInput[]
    updateMany?: SpaceImageUpdateManyWithWhereWithoutSpaceInput | SpaceImageUpdateManyWithWhereWithoutSpaceInput[]
    deleteMany?: SpaceImageScalarWhereInput | SpaceImageScalarWhereInput[]
  }

  export type SpaceAmenityUpdateManyWithoutSpaceNestedInput = {
    create?: XOR<SpaceAmenityCreateWithoutSpaceInput, SpaceAmenityUncheckedCreateWithoutSpaceInput> | SpaceAmenityCreateWithoutSpaceInput[] | SpaceAmenityUncheckedCreateWithoutSpaceInput[]
    connectOrCreate?: SpaceAmenityCreateOrConnectWithoutSpaceInput | SpaceAmenityCreateOrConnectWithoutSpaceInput[]
    upsert?: SpaceAmenityUpsertWithWhereUniqueWithoutSpaceInput | SpaceAmenityUpsertWithWhereUniqueWithoutSpaceInput[]
    createMany?: SpaceAmenityCreateManySpaceInputEnvelope
    set?: SpaceAmenityWhereUniqueInput | SpaceAmenityWhereUniqueInput[]
    disconnect?: SpaceAmenityWhereUniqueInput | SpaceAmenityWhereUniqueInput[]
    delete?: SpaceAmenityWhereUniqueInput | SpaceAmenityWhereUniqueInput[]
    connect?: SpaceAmenityWhereUniqueInput | SpaceAmenityWhereUniqueInput[]
    update?: SpaceAmenityUpdateWithWhereUniqueWithoutSpaceInput | SpaceAmenityUpdateWithWhereUniqueWithoutSpaceInput[]
    updateMany?: SpaceAmenityUpdateManyWithWhereWithoutSpaceInput | SpaceAmenityUpdateManyWithWhereWithoutSpaceInput[]
    deleteMany?: SpaceAmenityScalarWhereInput | SpaceAmenityScalarWhereInput[]
  }

  export type BookingUpdateManyWithoutSpaceNestedInput = {
    create?: XOR<BookingCreateWithoutSpaceInput, BookingUncheckedCreateWithoutSpaceInput> | BookingCreateWithoutSpaceInput[] | BookingUncheckedCreateWithoutSpaceInput[]
    connectOrCreate?: BookingCreateOrConnectWithoutSpaceInput | BookingCreateOrConnectWithoutSpaceInput[]
    upsert?: BookingUpsertWithWhereUniqueWithoutSpaceInput | BookingUpsertWithWhereUniqueWithoutSpaceInput[]
    createMany?: BookingCreateManySpaceInputEnvelope
    set?: BookingWhereUniqueInput | BookingWhereUniqueInput[]
    disconnect?: BookingWhereUniqueInput | BookingWhereUniqueInput[]
    delete?: BookingWhereUniqueInput | BookingWhereUniqueInput[]
    connect?: BookingWhereUniqueInput | BookingWhereUniqueInput[]
    update?: BookingUpdateWithWhereUniqueWithoutSpaceInput | BookingUpdateWithWhereUniqueWithoutSpaceInput[]
    updateMany?: BookingUpdateManyWithWhereWithoutSpaceInput | BookingUpdateManyWithWhereWithoutSpaceInput[]
    deleteMany?: BookingScalarWhereInput | BookingScalarWhereInput[]
  }

  export type SpaceImageUncheckedUpdateManyWithoutSpaceNestedInput = {
    create?: XOR<SpaceImageCreateWithoutSpaceInput, SpaceImageUncheckedCreateWithoutSpaceInput> | SpaceImageCreateWithoutSpaceInput[] | SpaceImageUncheckedCreateWithoutSpaceInput[]
    connectOrCreate?: SpaceImageCreateOrConnectWithoutSpaceInput | SpaceImageCreateOrConnectWithoutSpaceInput[]
    upsert?: SpaceImageUpsertWithWhereUniqueWithoutSpaceInput | SpaceImageUpsertWithWhereUniqueWithoutSpaceInput[]
    createMany?: SpaceImageCreateManySpaceInputEnvelope
    set?: SpaceImageWhereUniqueInput | SpaceImageWhereUniqueInput[]
    disconnect?: SpaceImageWhereUniqueInput | SpaceImageWhereUniqueInput[]
    delete?: SpaceImageWhereUniqueInput | SpaceImageWhereUniqueInput[]
    connect?: SpaceImageWhereUniqueInput | SpaceImageWhereUniqueInput[]
    update?: SpaceImageUpdateWithWhereUniqueWithoutSpaceInput | SpaceImageUpdateWithWhereUniqueWithoutSpaceInput[]
    updateMany?: SpaceImageUpdateManyWithWhereWithoutSpaceInput | SpaceImageUpdateManyWithWhereWithoutSpaceInput[]
    deleteMany?: SpaceImageScalarWhereInput | SpaceImageScalarWhereInput[]
  }

  export type SpaceAmenityUncheckedUpdateManyWithoutSpaceNestedInput = {
    create?: XOR<SpaceAmenityCreateWithoutSpaceInput, SpaceAmenityUncheckedCreateWithoutSpaceInput> | SpaceAmenityCreateWithoutSpaceInput[] | SpaceAmenityUncheckedCreateWithoutSpaceInput[]
    connectOrCreate?: SpaceAmenityCreateOrConnectWithoutSpaceInput | SpaceAmenityCreateOrConnectWithoutSpaceInput[]
    upsert?: SpaceAmenityUpsertWithWhereUniqueWithoutSpaceInput | SpaceAmenityUpsertWithWhereUniqueWithoutSpaceInput[]
    createMany?: SpaceAmenityCreateManySpaceInputEnvelope
    set?: SpaceAmenityWhereUniqueInput | SpaceAmenityWhereUniqueInput[]
    disconnect?: SpaceAmenityWhereUniqueInput | SpaceAmenityWhereUniqueInput[]
    delete?: SpaceAmenityWhereUniqueInput | SpaceAmenityWhereUniqueInput[]
    connect?: SpaceAmenityWhereUniqueInput | SpaceAmenityWhereUniqueInput[]
    update?: SpaceAmenityUpdateWithWhereUniqueWithoutSpaceInput | SpaceAmenityUpdateWithWhereUniqueWithoutSpaceInput[]
    updateMany?: SpaceAmenityUpdateManyWithWhereWithoutSpaceInput | SpaceAmenityUpdateManyWithWhereWithoutSpaceInput[]
    deleteMany?: SpaceAmenityScalarWhereInput | SpaceAmenityScalarWhereInput[]
  }

  export type BookingUncheckedUpdateManyWithoutSpaceNestedInput = {
    create?: XOR<BookingCreateWithoutSpaceInput, BookingUncheckedCreateWithoutSpaceInput> | BookingCreateWithoutSpaceInput[] | BookingUncheckedCreateWithoutSpaceInput[]
    connectOrCreate?: BookingCreateOrConnectWithoutSpaceInput | BookingCreateOrConnectWithoutSpaceInput[]
    upsert?: BookingUpsertWithWhereUniqueWithoutSpaceInput | BookingUpsertWithWhereUniqueWithoutSpaceInput[]
    createMany?: BookingCreateManySpaceInputEnvelope
    set?: BookingWhereUniqueInput | BookingWhereUniqueInput[]
    disconnect?: BookingWhereUniqueInput | BookingWhereUniqueInput[]
    delete?: BookingWhereUniqueInput | BookingWhereUniqueInput[]
    connect?: BookingWhereUniqueInput | BookingWhereUniqueInput[]
    update?: BookingUpdateWithWhereUniqueWithoutSpaceInput | BookingUpdateWithWhereUniqueWithoutSpaceInput[]
    updateMany?: BookingUpdateManyWithWhereWithoutSpaceInput | BookingUpdateManyWithWhereWithoutSpaceInput[]
    deleteMany?: BookingScalarWhereInput | BookingScalarWhereInput[]
  }

  export type SpaceCreateNestedOneWithoutImagesInput = {
    create?: XOR<SpaceCreateWithoutImagesInput, SpaceUncheckedCreateWithoutImagesInput>
    connectOrCreate?: SpaceCreateOrConnectWithoutImagesInput
    connect?: SpaceWhereUniqueInput
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type SpaceUpdateOneRequiredWithoutImagesNestedInput = {
    create?: XOR<SpaceCreateWithoutImagesInput, SpaceUncheckedCreateWithoutImagesInput>
    connectOrCreate?: SpaceCreateOrConnectWithoutImagesInput
    upsert?: SpaceUpsertWithoutImagesInput
    connect?: SpaceWhereUniqueInput
    update?: XOR<XOR<SpaceUpdateToOneWithWhereWithoutImagesInput, SpaceUpdateWithoutImagesInput>, SpaceUncheckedUpdateWithoutImagesInput>
  }

  export type SpaceCreateNestedOneWithoutAmenitiesInput = {
    create?: XOR<SpaceCreateWithoutAmenitiesInput, SpaceUncheckedCreateWithoutAmenitiesInput>
    connectOrCreate?: SpaceCreateOrConnectWithoutAmenitiesInput
    connect?: SpaceWhereUniqueInput
  }

  export type AmenityCreateNestedOneWithoutSpacesInput = {
    create?: XOR<AmenityCreateWithoutSpacesInput, AmenityUncheckedCreateWithoutSpacesInput>
    connectOrCreate?: AmenityCreateOrConnectWithoutSpacesInput
    connect?: AmenityWhereUniqueInput
  }

  export type SpaceUpdateOneRequiredWithoutAmenitiesNestedInput = {
    create?: XOR<SpaceCreateWithoutAmenitiesInput, SpaceUncheckedCreateWithoutAmenitiesInput>
    connectOrCreate?: SpaceCreateOrConnectWithoutAmenitiesInput
    upsert?: SpaceUpsertWithoutAmenitiesInput
    connect?: SpaceWhereUniqueInput
    update?: XOR<XOR<SpaceUpdateToOneWithWhereWithoutAmenitiesInput, SpaceUpdateWithoutAmenitiesInput>, SpaceUncheckedUpdateWithoutAmenitiesInput>
  }

  export type AmenityUpdateOneRequiredWithoutSpacesNestedInput = {
    create?: XOR<AmenityCreateWithoutSpacesInput, AmenityUncheckedCreateWithoutSpacesInput>
    connectOrCreate?: AmenityCreateOrConnectWithoutSpacesInput
    upsert?: AmenityUpsertWithoutSpacesInput
    connect?: AmenityWhereUniqueInput
    update?: XOR<XOR<AmenityUpdateToOneWithWhereWithoutSpacesInput, AmenityUpdateWithoutSpacesInput>, AmenityUncheckedUpdateWithoutSpacesInput>
  }

  export type SpaceCreateNestedOneWithoutBookingsInput = {
    create?: XOR<SpaceCreateWithoutBookingsInput, SpaceUncheckedCreateWithoutBookingsInput>
    connectOrCreate?: SpaceCreateOrConnectWithoutBookingsInput
    connect?: SpaceWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutBookingsInput = {
    create?: XOR<UserCreateWithoutBookingsInput, UserUncheckedCreateWithoutBookingsInput>
    connectOrCreate?: UserCreateOrConnectWithoutBookingsInput
    connect?: UserWhereUniqueInput
  }

  export type EnumBookingStatusFieldUpdateOperationsInput = {
    set?: $Enums.BookingStatus
  }

  export type SpaceUpdateOneRequiredWithoutBookingsNestedInput = {
    create?: XOR<SpaceCreateWithoutBookingsInput, SpaceUncheckedCreateWithoutBookingsInput>
    connectOrCreate?: SpaceCreateOrConnectWithoutBookingsInput
    upsert?: SpaceUpsertWithoutBookingsInput
    connect?: SpaceWhereUniqueInput
    update?: XOR<XOR<SpaceUpdateToOneWithWhereWithoutBookingsInput, SpaceUpdateWithoutBookingsInput>, SpaceUncheckedUpdateWithoutBookingsInput>
  }

  export type UserUpdateOneRequiredWithoutBookingsNestedInput = {
    create?: XOR<UserCreateWithoutBookingsInput, UserUncheckedCreateWithoutBookingsInput>
    connectOrCreate?: UserCreateOrConnectWithoutBookingsInput
    upsert?: UserUpsertWithoutBookingsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutBookingsInput, UserUpdateWithoutBookingsInput>, UserUncheckedUpdateWithoutBookingsInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedEnumRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumRoleFilter<$PrismaModel> | $Enums.Role
  }

  export type NestedEnumUserStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.UserStatus | EnumUserStatusFieldRefInput<$PrismaModel>
    in?: $Enums.UserStatus[] | ListEnumUserStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserStatus[] | ListEnumUserStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumUserStatusFilter<$PrismaModel> | $Enums.UserStatus
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedEnumRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumRoleWithAggregatesFilter<$PrismaModel> | $Enums.Role
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumRoleFilter<$PrismaModel>
    _max?: NestedEnumRoleFilter<$PrismaModel>
  }

  export type NestedEnumUserStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.UserStatus | EnumUserStatusFieldRefInput<$PrismaModel>
    in?: $Enums.UserStatus[] | ListEnumUserStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserStatus[] | ListEnumUserStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumUserStatusWithAggregatesFilter<$PrismaModel> | $Enums.UserStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumUserStatusFilter<$PrismaModel>
    _max?: NestedEnumUserStatusFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedEnumSpaceStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.SpaceStatus | EnumSpaceStatusFieldRefInput<$PrismaModel>
    in?: $Enums.SpaceStatus[] | ListEnumSpaceStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.SpaceStatus[] | ListEnumSpaceStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumSpaceStatusFilter<$PrismaModel> | $Enums.SpaceStatus
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedFloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type NestedEnumSpaceStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.SpaceStatus | EnumSpaceStatusFieldRefInput<$PrismaModel>
    in?: $Enums.SpaceStatus[] | ListEnumSpaceStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.SpaceStatus[] | ListEnumSpaceStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumSpaceStatusWithAggregatesFilter<$PrismaModel> | $Enums.SpaceStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumSpaceStatusFilter<$PrismaModel>
    _max?: NestedEnumSpaceStatusFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedEnumBookingStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.BookingStatus | EnumBookingStatusFieldRefInput<$PrismaModel>
    in?: $Enums.BookingStatus[] | ListEnumBookingStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.BookingStatus[] | ListEnumBookingStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumBookingStatusFilter<$PrismaModel> | $Enums.BookingStatus
  }

  export type NestedEnumBookingStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.BookingStatus | EnumBookingStatusFieldRefInput<$PrismaModel>
    in?: $Enums.BookingStatus[] | ListEnumBookingStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.BookingStatus[] | ListEnumBookingStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumBookingStatusWithAggregatesFilter<$PrismaModel> | $Enums.BookingStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumBookingStatusFilter<$PrismaModel>
    _max?: NestedEnumBookingStatusFilter<$PrismaModel>
  }

  export type SpaceCreateWithoutSellerInput = {
    id?: string
    name: string
    description?: string | null
    city: string
    district?: string | null
    address?: string | null
    capacity?: number | null
    price: number
    pricePeriod?: string
    status?: $Enums.SpaceStatus
    adminNotes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    type: SpaceTypeCreateNestedOneWithoutSpacesInput
    images?: SpaceImageCreateNestedManyWithoutSpaceInput
    amenities?: SpaceAmenityCreateNestedManyWithoutSpaceInput
    bookings?: BookingCreateNestedManyWithoutSpaceInput
  }

  export type SpaceUncheckedCreateWithoutSellerInput = {
    id?: string
    name: string
    description?: string | null
    city: string
    district?: string | null
    address?: string | null
    capacity?: number | null
    price: number
    pricePeriod?: string
    status?: $Enums.SpaceStatus
    adminNotes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    typeId: string
    images?: SpaceImageUncheckedCreateNestedManyWithoutSpaceInput
    amenities?: SpaceAmenityUncheckedCreateNestedManyWithoutSpaceInput
    bookings?: BookingUncheckedCreateNestedManyWithoutSpaceInput
  }

  export type SpaceCreateOrConnectWithoutSellerInput = {
    where: SpaceWhereUniqueInput
    create: XOR<SpaceCreateWithoutSellerInput, SpaceUncheckedCreateWithoutSellerInput>
  }

  export type SpaceCreateManySellerInputEnvelope = {
    data: SpaceCreateManySellerInput | SpaceCreateManySellerInput[]
    skipDuplicates?: boolean
  }

  export type BookingCreateWithoutBuyerInput = {
    id?: string
    date: string
    startTime: string
    endTime: string
    persons?: number | null
    notes?: string | null
    status?: $Enums.BookingStatus
    sellerNote?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    space: SpaceCreateNestedOneWithoutBookingsInput
  }

  export type BookingUncheckedCreateWithoutBuyerInput = {
    id?: string
    date: string
    startTime: string
    endTime: string
    persons?: number | null
    notes?: string | null
    status?: $Enums.BookingStatus
    sellerNote?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    spaceId: string
  }

  export type BookingCreateOrConnectWithoutBuyerInput = {
    where: BookingWhereUniqueInput
    create: XOR<BookingCreateWithoutBuyerInput, BookingUncheckedCreateWithoutBuyerInput>
  }

  export type BookingCreateManyBuyerInputEnvelope = {
    data: BookingCreateManyBuyerInput | BookingCreateManyBuyerInput[]
    skipDuplicates?: boolean
  }

  export type SpaceUpsertWithWhereUniqueWithoutSellerInput = {
    where: SpaceWhereUniqueInput
    update: XOR<SpaceUpdateWithoutSellerInput, SpaceUncheckedUpdateWithoutSellerInput>
    create: XOR<SpaceCreateWithoutSellerInput, SpaceUncheckedCreateWithoutSellerInput>
  }

  export type SpaceUpdateWithWhereUniqueWithoutSellerInput = {
    where: SpaceWhereUniqueInput
    data: XOR<SpaceUpdateWithoutSellerInput, SpaceUncheckedUpdateWithoutSellerInput>
  }

  export type SpaceUpdateManyWithWhereWithoutSellerInput = {
    where: SpaceScalarWhereInput
    data: XOR<SpaceUpdateManyMutationInput, SpaceUncheckedUpdateManyWithoutSellerInput>
  }

  export type SpaceScalarWhereInput = {
    AND?: SpaceScalarWhereInput | SpaceScalarWhereInput[]
    OR?: SpaceScalarWhereInput[]
    NOT?: SpaceScalarWhereInput | SpaceScalarWhereInput[]
    id?: StringFilter<"Space"> | string
    name?: StringFilter<"Space"> | string
    description?: StringNullableFilter<"Space"> | string | null
    city?: StringFilter<"Space"> | string
    district?: StringNullableFilter<"Space"> | string | null
    address?: StringNullableFilter<"Space"> | string | null
    capacity?: IntNullableFilter<"Space"> | number | null
    price?: FloatFilter<"Space"> | number
    pricePeriod?: StringFilter<"Space"> | string
    status?: EnumSpaceStatusFilter<"Space"> | $Enums.SpaceStatus
    adminNotes?: StringNullableFilter<"Space"> | string | null
    createdAt?: DateTimeFilter<"Space"> | Date | string
    updatedAt?: DateTimeFilter<"Space"> | Date | string
    typeId?: StringFilter<"Space"> | string
    sellerId?: StringFilter<"Space"> | string
  }

  export type BookingUpsertWithWhereUniqueWithoutBuyerInput = {
    where: BookingWhereUniqueInput
    update: XOR<BookingUpdateWithoutBuyerInput, BookingUncheckedUpdateWithoutBuyerInput>
    create: XOR<BookingCreateWithoutBuyerInput, BookingUncheckedCreateWithoutBuyerInput>
  }

  export type BookingUpdateWithWhereUniqueWithoutBuyerInput = {
    where: BookingWhereUniqueInput
    data: XOR<BookingUpdateWithoutBuyerInput, BookingUncheckedUpdateWithoutBuyerInput>
  }

  export type BookingUpdateManyWithWhereWithoutBuyerInput = {
    where: BookingScalarWhereInput
    data: XOR<BookingUpdateManyMutationInput, BookingUncheckedUpdateManyWithoutBuyerInput>
  }

  export type BookingScalarWhereInput = {
    AND?: BookingScalarWhereInput | BookingScalarWhereInput[]
    OR?: BookingScalarWhereInput[]
    NOT?: BookingScalarWhereInput | BookingScalarWhereInput[]
    id?: StringFilter<"Booking"> | string
    date?: StringFilter<"Booking"> | string
    startTime?: StringFilter<"Booking"> | string
    endTime?: StringFilter<"Booking"> | string
    persons?: IntNullableFilter<"Booking"> | number | null
    notes?: StringNullableFilter<"Booking"> | string | null
    status?: EnumBookingStatusFilter<"Booking"> | $Enums.BookingStatus
    sellerNote?: StringNullableFilter<"Booking"> | string | null
    createdAt?: DateTimeFilter<"Booking"> | Date | string
    updatedAt?: DateTimeFilter<"Booking"> | Date | string
    spaceId?: StringFilter<"Booking"> | string
    buyerId?: StringFilter<"Booking"> | string
  }

  export type SpaceCreateWithoutTypeInput = {
    id?: string
    name: string
    description?: string | null
    city: string
    district?: string | null
    address?: string | null
    capacity?: number | null
    price: number
    pricePeriod?: string
    status?: $Enums.SpaceStatus
    adminNotes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    seller: UserCreateNestedOneWithoutSpacesInput
    images?: SpaceImageCreateNestedManyWithoutSpaceInput
    amenities?: SpaceAmenityCreateNestedManyWithoutSpaceInput
    bookings?: BookingCreateNestedManyWithoutSpaceInput
  }

  export type SpaceUncheckedCreateWithoutTypeInput = {
    id?: string
    name: string
    description?: string | null
    city: string
    district?: string | null
    address?: string | null
    capacity?: number | null
    price: number
    pricePeriod?: string
    status?: $Enums.SpaceStatus
    adminNotes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    sellerId: string
    images?: SpaceImageUncheckedCreateNestedManyWithoutSpaceInput
    amenities?: SpaceAmenityUncheckedCreateNestedManyWithoutSpaceInput
    bookings?: BookingUncheckedCreateNestedManyWithoutSpaceInput
  }

  export type SpaceCreateOrConnectWithoutTypeInput = {
    where: SpaceWhereUniqueInput
    create: XOR<SpaceCreateWithoutTypeInput, SpaceUncheckedCreateWithoutTypeInput>
  }

  export type SpaceCreateManyTypeInputEnvelope = {
    data: SpaceCreateManyTypeInput | SpaceCreateManyTypeInput[]
    skipDuplicates?: boolean
  }

  export type SpaceUpsertWithWhereUniqueWithoutTypeInput = {
    where: SpaceWhereUniqueInput
    update: XOR<SpaceUpdateWithoutTypeInput, SpaceUncheckedUpdateWithoutTypeInput>
    create: XOR<SpaceCreateWithoutTypeInput, SpaceUncheckedCreateWithoutTypeInput>
  }

  export type SpaceUpdateWithWhereUniqueWithoutTypeInput = {
    where: SpaceWhereUniqueInput
    data: XOR<SpaceUpdateWithoutTypeInput, SpaceUncheckedUpdateWithoutTypeInput>
  }

  export type SpaceUpdateManyWithWhereWithoutTypeInput = {
    where: SpaceScalarWhereInput
    data: XOR<SpaceUpdateManyMutationInput, SpaceUncheckedUpdateManyWithoutTypeInput>
  }

  export type SpaceAmenityCreateWithoutAmenityInput = {
    space: SpaceCreateNestedOneWithoutAmenitiesInput
  }

  export type SpaceAmenityUncheckedCreateWithoutAmenityInput = {
    spaceId: string
  }

  export type SpaceAmenityCreateOrConnectWithoutAmenityInput = {
    where: SpaceAmenityWhereUniqueInput
    create: XOR<SpaceAmenityCreateWithoutAmenityInput, SpaceAmenityUncheckedCreateWithoutAmenityInput>
  }

  export type SpaceAmenityCreateManyAmenityInputEnvelope = {
    data: SpaceAmenityCreateManyAmenityInput | SpaceAmenityCreateManyAmenityInput[]
    skipDuplicates?: boolean
  }

  export type SpaceAmenityUpsertWithWhereUniqueWithoutAmenityInput = {
    where: SpaceAmenityWhereUniqueInput
    update: XOR<SpaceAmenityUpdateWithoutAmenityInput, SpaceAmenityUncheckedUpdateWithoutAmenityInput>
    create: XOR<SpaceAmenityCreateWithoutAmenityInput, SpaceAmenityUncheckedCreateWithoutAmenityInput>
  }

  export type SpaceAmenityUpdateWithWhereUniqueWithoutAmenityInput = {
    where: SpaceAmenityWhereUniqueInput
    data: XOR<SpaceAmenityUpdateWithoutAmenityInput, SpaceAmenityUncheckedUpdateWithoutAmenityInput>
  }

  export type SpaceAmenityUpdateManyWithWhereWithoutAmenityInput = {
    where: SpaceAmenityScalarWhereInput
    data: XOR<SpaceAmenityUpdateManyMutationInput, SpaceAmenityUncheckedUpdateManyWithoutAmenityInput>
  }

  export type SpaceAmenityScalarWhereInput = {
    AND?: SpaceAmenityScalarWhereInput | SpaceAmenityScalarWhereInput[]
    OR?: SpaceAmenityScalarWhereInput[]
    NOT?: SpaceAmenityScalarWhereInput | SpaceAmenityScalarWhereInput[]
    spaceId?: StringFilter<"SpaceAmenity"> | string
    amenityId?: StringFilter<"SpaceAmenity"> | string
  }

  export type SpaceTypeCreateWithoutSpacesInput = {
    id?: string
    name: string
  }

  export type SpaceTypeUncheckedCreateWithoutSpacesInput = {
    id?: string
    name: string
  }

  export type SpaceTypeCreateOrConnectWithoutSpacesInput = {
    where: SpaceTypeWhereUniqueInput
    create: XOR<SpaceTypeCreateWithoutSpacesInput, SpaceTypeUncheckedCreateWithoutSpacesInput>
  }

  export type UserCreateWithoutSpacesInput = {
    id?: string
    name: string
    email: string
    phone?: string | null
    password: string
    role?: $Enums.Role
    status?: $Enums.UserStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    bookings?: BookingCreateNestedManyWithoutBuyerInput
  }

  export type UserUncheckedCreateWithoutSpacesInput = {
    id?: string
    name: string
    email: string
    phone?: string | null
    password: string
    role?: $Enums.Role
    status?: $Enums.UserStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    bookings?: BookingUncheckedCreateNestedManyWithoutBuyerInput
  }

  export type UserCreateOrConnectWithoutSpacesInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutSpacesInput, UserUncheckedCreateWithoutSpacesInput>
  }

  export type SpaceImageCreateWithoutSpaceInput = {
    id?: string
    url: string
    order?: number
  }

  export type SpaceImageUncheckedCreateWithoutSpaceInput = {
    id?: string
    url: string
    order?: number
  }

  export type SpaceImageCreateOrConnectWithoutSpaceInput = {
    where: SpaceImageWhereUniqueInput
    create: XOR<SpaceImageCreateWithoutSpaceInput, SpaceImageUncheckedCreateWithoutSpaceInput>
  }

  export type SpaceImageCreateManySpaceInputEnvelope = {
    data: SpaceImageCreateManySpaceInput | SpaceImageCreateManySpaceInput[]
    skipDuplicates?: boolean
  }

  export type SpaceAmenityCreateWithoutSpaceInput = {
    amenity: AmenityCreateNestedOneWithoutSpacesInput
  }

  export type SpaceAmenityUncheckedCreateWithoutSpaceInput = {
    amenityId: string
  }

  export type SpaceAmenityCreateOrConnectWithoutSpaceInput = {
    where: SpaceAmenityWhereUniqueInput
    create: XOR<SpaceAmenityCreateWithoutSpaceInput, SpaceAmenityUncheckedCreateWithoutSpaceInput>
  }

  export type SpaceAmenityCreateManySpaceInputEnvelope = {
    data: SpaceAmenityCreateManySpaceInput | SpaceAmenityCreateManySpaceInput[]
    skipDuplicates?: boolean
  }

  export type BookingCreateWithoutSpaceInput = {
    id?: string
    date: string
    startTime: string
    endTime: string
    persons?: number | null
    notes?: string | null
    status?: $Enums.BookingStatus
    sellerNote?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    buyer: UserCreateNestedOneWithoutBookingsInput
  }

  export type BookingUncheckedCreateWithoutSpaceInput = {
    id?: string
    date: string
    startTime: string
    endTime: string
    persons?: number | null
    notes?: string | null
    status?: $Enums.BookingStatus
    sellerNote?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    buyerId: string
  }

  export type BookingCreateOrConnectWithoutSpaceInput = {
    where: BookingWhereUniqueInput
    create: XOR<BookingCreateWithoutSpaceInput, BookingUncheckedCreateWithoutSpaceInput>
  }

  export type BookingCreateManySpaceInputEnvelope = {
    data: BookingCreateManySpaceInput | BookingCreateManySpaceInput[]
    skipDuplicates?: boolean
  }

  export type SpaceTypeUpsertWithoutSpacesInput = {
    update: XOR<SpaceTypeUpdateWithoutSpacesInput, SpaceTypeUncheckedUpdateWithoutSpacesInput>
    create: XOR<SpaceTypeCreateWithoutSpacesInput, SpaceTypeUncheckedCreateWithoutSpacesInput>
    where?: SpaceTypeWhereInput
  }

  export type SpaceTypeUpdateToOneWithWhereWithoutSpacesInput = {
    where?: SpaceTypeWhereInput
    data: XOR<SpaceTypeUpdateWithoutSpacesInput, SpaceTypeUncheckedUpdateWithoutSpacesInput>
  }

  export type SpaceTypeUpdateWithoutSpacesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
  }

  export type SpaceTypeUncheckedUpdateWithoutSpacesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
  }

  export type UserUpsertWithoutSpacesInput = {
    update: XOR<UserUpdateWithoutSpacesInput, UserUncheckedUpdateWithoutSpacesInput>
    create: XOR<UserCreateWithoutSpacesInput, UserUncheckedCreateWithoutSpacesInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutSpacesInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutSpacesInput, UserUncheckedUpdateWithoutSpacesInput>
  }

  export type UserUpdateWithoutSpacesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    status?: EnumUserStatusFieldUpdateOperationsInput | $Enums.UserStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    bookings?: BookingUpdateManyWithoutBuyerNestedInput
  }

  export type UserUncheckedUpdateWithoutSpacesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    status?: EnumUserStatusFieldUpdateOperationsInput | $Enums.UserStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    bookings?: BookingUncheckedUpdateManyWithoutBuyerNestedInput
  }

  export type SpaceImageUpsertWithWhereUniqueWithoutSpaceInput = {
    where: SpaceImageWhereUniqueInput
    update: XOR<SpaceImageUpdateWithoutSpaceInput, SpaceImageUncheckedUpdateWithoutSpaceInput>
    create: XOR<SpaceImageCreateWithoutSpaceInput, SpaceImageUncheckedCreateWithoutSpaceInput>
  }

  export type SpaceImageUpdateWithWhereUniqueWithoutSpaceInput = {
    where: SpaceImageWhereUniqueInput
    data: XOR<SpaceImageUpdateWithoutSpaceInput, SpaceImageUncheckedUpdateWithoutSpaceInput>
  }

  export type SpaceImageUpdateManyWithWhereWithoutSpaceInput = {
    where: SpaceImageScalarWhereInput
    data: XOR<SpaceImageUpdateManyMutationInput, SpaceImageUncheckedUpdateManyWithoutSpaceInput>
  }

  export type SpaceImageScalarWhereInput = {
    AND?: SpaceImageScalarWhereInput | SpaceImageScalarWhereInput[]
    OR?: SpaceImageScalarWhereInput[]
    NOT?: SpaceImageScalarWhereInput | SpaceImageScalarWhereInput[]
    id?: StringFilter<"SpaceImage"> | string
    url?: StringFilter<"SpaceImage"> | string
    order?: IntFilter<"SpaceImage"> | number
    spaceId?: StringFilter<"SpaceImage"> | string
  }

  export type SpaceAmenityUpsertWithWhereUniqueWithoutSpaceInput = {
    where: SpaceAmenityWhereUniqueInput
    update: XOR<SpaceAmenityUpdateWithoutSpaceInput, SpaceAmenityUncheckedUpdateWithoutSpaceInput>
    create: XOR<SpaceAmenityCreateWithoutSpaceInput, SpaceAmenityUncheckedCreateWithoutSpaceInput>
  }

  export type SpaceAmenityUpdateWithWhereUniqueWithoutSpaceInput = {
    where: SpaceAmenityWhereUniqueInput
    data: XOR<SpaceAmenityUpdateWithoutSpaceInput, SpaceAmenityUncheckedUpdateWithoutSpaceInput>
  }

  export type SpaceAmenityUpdateManyWithWhereWithoutSpaceInput = {
    where: SpaceAmenityScalarWhereInput
    data: XOR<SpaceAmenityUpdateManyMutationInput, SpaceAmenityUncheckedUpdateManyWithoutSpaceInput>
  }

  export type BookingUpsertWithWhereUniqueWithoutSpaceInput = {
    where: BookingWhereUniqueInput
    update: XOR<BookingUpdateWithoutSpaceInput, BookingUncheckedUpdateWithoutSpaceInput>
    create: XOR<BookingCreateWithoutSpaceInput, BookingUncheckedCreateWithoutSpaceInput>
  }

  export type BookingUpdateWithWhereUniqueWithoutSpaceInput = {
    where: BookingWhereUniqueInput
    data: XOR<BookingUpdateWithoutSpaceInput, BookingUncheckedUpdateWithoutSpaceInput>
  }

  export type BookingUpdateManyWithWhereWithoutSpaceInput = {
    where: BookingScalarWhereInput
    data: XOR<BookingUpdateManyMutationInput, BookingUncheckedUpdateManyWithoutSpaceInput>
  }

  export type SpaceCreateWithoutImagesInput = {
    id?: string
    name: string
    description?: string | null
    city: string
    district?: string | null
    address?: string | null
    capacity?: number | null
    price: number
    pricePeriod?: string
    status?: $Enums.SpaceStatus
    adminNotes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    type: SpaceTypeCreateNestedOneWithoutSpacesInput
    seller: UserCreateNestedOneWithoutSpacesInput
    amenities?: SpaceAmenityCreateNestedManyWithoutSpaceInput
    bookings?: BookingCreateNestedManyWithoutSpaceInput
  }

  export type SpaceUncheckedCreateWithoutImagesInput = {
    id?: string
    name: string
    description?: string | null
    city: string
    district?: string | null
    address?: string | null
    capacity?: number | null
    price: number
    pricePeriod?: string
    status?: $Enums.SpaceStatus
    adminNotes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    typeId: string
    sellerId: string
    amenities?: SpaceAmenityUncheckedCreateNestedManyWithoutSpaceInput
    bookings?: BookingUncheckedCreateNestedManyWithoutSpaceInput
  }

  export type SpaceCreateOrConnectWithoutImagesInput = {
    where: SpaceWhereUniqueInput
    create: XOR<SpaceCreateWithoutImagesInput, SpaceUncheckedCreateWithoutImagesInput>
  }

  export type SpaceUpsertWithoutImagesInput = {
    update: XOR<SpaceUpdateWithoutImagesInput, SpaceUncheckedUpdateWithoutImagesInput>
    create: XOR<SpaceCreateWithoutImagesInput, SpaceUncheckedCreateWithoutImagesInput>
    where?: SpaceWhereInput
  }

  export type SpaceUpdateToOneWithWhereWithoutImagesInput = {
    where?: SpaceWhereInput
    data: XOR<SpaceUpdateWithoutImagesInput, SpaceUncheckedUpdateWithoutImagesInput>
  }

  export type SpaceUpdateWithoutImagesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    city?: StringFieldUpdateOperationsInput | string
    district?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    capacity?: NullableIntFieldUpdateOperationsInput | number | null
    price?: FloatFieldUpdateOperationsInput | number
    pricePeriod?: StringFieldUpdateOperationsInput | string
    status?: EnumSpaceStatusFieldUpdateOperationsInput | $Enums.SpaceStatus
    adminNotes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    type?: SpaceTypeUpdateOneRequiredWithoutSpacesNestedInput
    seller?: UserUpdateOneRequiredWithoutSpacesNestedInput
    amenities?: SpaceAmenityUpdateManyWithoutSpaceNestedInput
    bookings?: BookingUpdateManyWithoutSpaceNestedInput
  }

  export type SpaceUncheckedUpdateWithoutImagesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    city?: StringFieldUpdateOperationsInput | string
    district?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    capacity?: NullableIntFieldUpdateOperationsInput | number | null
    price?: FloatFieldUpdateOperationsInput | number
    pricePeriod?: StringFieldUpdateOperationsInput | string
    status?: EnumSpaceStatusFieldUpdateOperationsInput | $Enums.SpaceStatus
    adminNotes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    typeId?: StringFieldUpdateOperationsInput | string
    sellerId?: StringFieldUpdateOperationsInput | string
    amenities?: SpaceAmenityUncheckedUpdateManyWithoutSpaceNestedInput
    bookings?: BookingUncheckedUpdateManyWithoutSpaceNestedInput
  }

  export type SpaceCreateWithoutAmenitiesInput = {
    id?: string
    name: string
    description?: string | null
    city: string
    district?: string | null
    address?: string | null
    capacity?: number | null
    price: number
    pricePeriod?: string
    status?: $Enums.SpaceStatus
    adminNotes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    type: SpaceTypeCreateNestedOneWithoutSpacesInput
    seller: UserCreateNestedOneWithoutSpacesInput
    images?: SpaceImageCreateNestedManyWithoutSpaceInput
    bookings?: BookingCreateNestedManyWithoutSpaceInput
  }

  export type SpaceUncheckedCreateWithoutAmenitiesInput = {
    id?: string
    name: string
    description?: string | null
    city: string
    district?: string | null
    address?: string | null
    capacity?: number | null
    price: number
    pricePeriod?: string
    status?: $Enums.SpaceStatus
    adminNotes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    typeId: string
    sellerId: string
    images?: SpaceImageUncheckedCreateNestedManyWithoutSpaceInput
    bookings?: BookingUncheckedCreateNestedManyWithoutSpaceInput
  }

  export type SpaceCreateOrConnectWithoutAmenitiesInput = {
    where: SpaceWhereUniqueInput
    create: XOR<SpaceCreateWithoutAmenitiesInput, SpaceUncheckedCreateWithoutAmenitiesInput>
  }

  export type AmenityCreateWithoutSpacesInput = {
    id?: string
    name: string
    icon?: string | null
  }

  export type AmenityUncheckedCreateWithoutSpacesInput = {
    id?: string
    name: string
    icon?: string | null
  }

  export type AmenityCreateOrConnectWithoutSpacesInput = {
    where: AmenityWhereUniqueInput
    create: XOR<AmenityCreateWithoutSpacesInput, AmenityUncheckedCreateWithoutSpacesInput>
  }

  export type SpaceUpsertWithoutAmenitiesInput = {
    update: XOR<SpaceUpdateWithoutAmenitiesInput, SpaceUncheckedUpdateWithoutAmenitiesInput>
    create: XOR<SpaceCreateWithoutAmenitiesInput, SpaceUncheckedCreateWithoutAmenitiesInput>
    where?: SpaceWhereInput
  }

  export type SpaceUpdateToOneWithWhereWithoutAmenitiesInput = {
    where?: SpaceWhereInput
    data: XOR<SpaceUpdateWithoutAmenitiesInput, SpaceUncheckedUpdateWithoutAmenitiesInput>
  }

  export type SpaceUpdateWithoutAmenitiesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    city?: StringFieldUpdateOperationsInput | string
    district?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    capacity?: NullableIntFieldUpdateOperationsInput | number | null
    price?: FloatFieldUpdateOperationsInput | number
    pricePeriod?: StringFieldUpdateOperationsInput | string
    status?: EnumSpaceStatusFieldUpdateOperationsInput | $Enums.SpaceStatus
    adminNotes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    type?: SpaceTypeUpdateOneRequiredWithoutSpacesNestedInput
    seller?: UserUpdateOneRequiredWithoutSpacesNestedInput
    images?: SpaceImageUpdateManyWithoutSpaceNestedInput
    bookings?: BookingUpdateManyWithoutSpaceNestedInput
  }

  export type SpaceUncheckedUpdateWithoutAmenitiesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    city?: StringFieldUpdateOperationsInput | string
    district?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    capacity?: NullableIntFieldUpdateOperationsInput | number | null
    price?: FloatFieldUpdateOperationsInput | number
    pricePeriod?: StringFieldUpdateOperationsInput | string
    status?: EnumSpaceStatusFieldUpdateOperationsInput | $Enums.SpaceStatus
    adminNotes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    typeId?: StringFieldUpdateOperationsInput | string
    sellerId?: StringFieldUpdateOperationsInput | string
    images?: SpaceImageUncheckedUpdateManyWithoutSpaceNestedInput
    bookings?: BookingUncheckedUpdateManyWithoutSpaceNestedInput
  }

  export type AmenityUpsertWithoutSpacesInput = {
    update: XOR<AmenityUpdateWithoutSpacesInput, AmenityUncheckedUpdateWithoutSpacesInput>
    create: XOR<AmenityCreateWithoutSpacesInput, AmenityUncheckedCreateWithoutSpacesInput>
    where?: AmenityWhereInput
  }

  export type AmenityUpdateToOneWithWhereWithoutSpacesInput = {
    where?: AmenityWhereInput
    data: XOR<AmenityUpdateWithoutSpacesInput, AmenityUncheckedUpdateWithoutSpacesInput>
  }

  export type AmenityUpdateWithoutSpacesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    icon?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type AmenityUncheckedUpdateWithoutSpacesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    icon?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type SpaceCreateWithoutBookingsInput = {
    id?: string
    name: string
    description?: string | null
    city: string
    district?: string | null
    address?: string | null
    capacity?: number | null
    price: number
    pricePeriod?: string
    status?: $Enums.SpaceStatus
    adminNotes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    type: SpaceTypeCreateNestedOneWithoutSpacesInput
    seller: UserCreateNestedOneWithoutSpacesInput
    images?: SpaceImageCreateNestedManyWithoutSpaceInput
    amenities?: SpaceAmenityCreateNestedManyWithoutSpaceInput
  }

  export type SpaceUncheckedCreateWithoutBookingsInput = {
    id?: string
    name: string
    description?: string | null
    city: string
    district?: string | null
    address?: string | null
    capacity?: number | null
    price: number
    pricePeriod?: string
    status?: $Enums.SpaceStatus
    adminNotes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    typeId: string
    sellerId: string
    images?: SpaceImageUncheckedCreateNestedManyWithoutSpaceInput
    amenities?: SpaceAmenityUncheckedCreateNestedManyWithoutSpaceInput
  }

  export type SpaceCreateOrConnectWithoutBookingsInput = {
    where: SpaceWhereUniqueInput
    create: XOR<SpaceCreateWithoutBookingsInput, SpaceUncheckedCreateWithoutBookingsInput>
  }

  export type UserCreateWithoutBookingsInput = {
    id?: string
    name: string
    email: string
    phone?: string | null
    password: string
    role?: $Enums.Role
    status?: $Enums.UserStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    spaces?: SpaceCreateNestedManyWithoutSellerInput
  }

  export type UserUncheckedCreateWithoutBookingsInput = {
    id?: string
    name: string
    email: string
    phone?: string | null
    password: string
    role?: $Enums.Role
    status?: $Enums.UserStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    spaces?: SpaceUncheckedCreateNestedManyWithoutSellerInput
  }

  export type UserCreateOrConnectWithoutBookingsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutBookingsInput, UserUncheckedCreateWithoutBookingsInput>
  }

  export type SpaceUpsertWithoutBookingsInput = {
    update: XOR<SpaceUpdateWithoutBookingsInput, SpaceUncheckedUpdateWithoutBookingsInput>
    create: XOR<SpaceCreateWithoutBookingsInput, SpaceUncheckedCreateWithoutBookingsInput>
    where?: SpaceWhereInput
  }

  export type SpaceUpdateToOneWithWhereWithoutBookingsInput = {
    where?: SpaceWhereInput
    data: XOR<SpaceUpdateWithoutBookingsInput, SpaceUncheckedUpdateWithoutBookingsInput>
  }

  export type SpaceUpdateWithoutBookingsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    city?: StringFieldUpdateOperationsInput | string
    district?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    capacity?: NullableIntFieldUpdateOperationsInput | number | null
    price?: FloatFieldUpdateOperationsInput | number
    pricePeriod?: StringFieldUpdateOperationsInput | string
    status?: EnumSpaceStatusFieldUpdateOperationsInput | $Enums.SpaceStatus
    adminNotes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    type?: SpaceTypeUpdateOneRequiredWithoutSpacesNestedInput
    seller?: UserUpdateOneRequiredWithoutSpacesNestedInput
    images?: SpaceImageUpdateManyWithoutSpaceNestedInput
    amenities?: SpaceAmenityUpdateManyWithoutSpaceNestedInput
  }

  export type SpaceUncheckedUpdateWithoutBookingsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    city?: StringFieldUpdateOperationsInput | string
    district?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    capacity?: NullableIntFieldUpdateOperationsInput | number | null
    price?: FloatFieldUpdateOperationsInput | number
    pricePeriod?: StringFieldUpdateOperationsInput | string
    status?: EnumSpaceStatusFieldUpdateOperationsInput | $Enums.SpaceStatus
    adminNotes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    typeId?: StringFieldUpdateOperationsInput | string
    sellerId?: StringFieldUpdateOperationsInput | string
    images?: SpaceImageUncheckedUpdateManyWithoutSpaceNestedInput
    amenities?: SpaceAmenityUncheckedUpdateManyWithoutSpaceNestedInput
  }

  export type UserUpsertWithoutBookingsInput = {
    update: XOR<UserUpdateWithoutBookingsInput, UserUncheckedUpdateWithoutBookingsInput>
    create: XOR<UserCreateWithoutBookingsInput, UserUncheckedCreateWithoutBookingsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutBookingsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutBookingsInput, UserUncheckedUpdateWithoutBookingsInput>
  }

  export type UserUpdateWithoutBookingsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    status?: EnumUserStatusFieldUpdateOperationsInput | $Enums.UserStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    spaces?: SpaceUpdateManyWithoutSellerNestedInput
  }

  export type UserUncheckedUpdateWithoutBookingsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    status?: EnumUserStatusFieldUpdateOperationsInput | $Enums.UserStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    spaces?: SpaceUncheckedUpdateManyWithoutSellerNestedInput
  }

  export type SpaceCreateManySellerInput = {
    id?: string
    name: string
    description?: string | null
    city: string
    district?: string | null
    address?: string | null
    capacity?: number | null
    price: number
    pricePeriod?: string
    status?: $Enums.SpaceStatus
    adminNotes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    typeId: string
  }

  export type BookingCreateManyBuyerInput = {
    id?: string
    date: string
    startTime: string
    endTime: string
    persons?: number | null
    notes?: string | null
    status?: $Enums.BookingStatus
    sellerNote?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    spaceId: string
  }

  export type SpaceUpdateWithoutSellerInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    city?: StringFieldUpdateOperationsInput | string
    district?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    capacity?: NullableIntFieldUpdateOperationsInput | number | null
    price?: FloatFieldUpdateOperationsInput | number
    pricePeriod?: StringFieldUpdateOperationsInput | string
    status?: EnumSpaceStatusFieldUpdateOperationsInput | $Enums.SpaceStatus
    adminNotes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    type?: SpaceTypeUpdateOneRequiredWithoutSpacesNestedInput
    images?: SpaceImageUpdateManyWithoutSpaceNestedInput
    amenities?: SpaceAmenityUpdateManyWithoutSpaceNestedInput
    bookings?: BookingUpdateManyWithoutSpaceNestedInput
  }

  export type SpaceUncheckedUpdateWithoutSellerInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    city?: StringFieldUpdateOperationsInput | string
    district?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    capacity?: NullableIntFieldUpdateOperationsInput | number | null
    price?: FloatFieldUpdateOperationsInput | number
    pricePeriod?: StringFieldUpdateOperationsInput | string
    status?: EnumSpaceStatusFieldUpdateOperationsInput | $Enums.SpaceStatus
    adminNotes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    typeId?: StringFieldUpdateOperationsInput | string
    images?: SpaceImageUncheckedUpdateManyWithoutSpaceNestedInput
    amenities?: SpaceAmenityUncheckedUpdateManyWithoutSpaceNestedInput
    bookings?: BookingUncheckedUpdateManyWithoutSpaceNestedInput
  }

  export type SpaceUncheckedUpdateManyWithoutSellerInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    city?: StringFieldUpdateOperationsInput | string
    district?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    capacity?: NullableIntFieldUpdateOperationsInput | number | null
    price?: FloatFieldUpdateOperationsInput | number
    pricePeriod?: StringFieldUpdateOperationsInput | string
    status?: EnumSpaceStatusFieldUpdateOperationsInput | $Enums.SpaceStatus
    adminNotes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    typeId?: StringFieldUpdateOperationsInput | string
  }

  export type BookingUpdateWithoutBuyerInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: StringFieldUpdateOperationsInput | string
    startTime?: StringFieldUpdateOperationsInput | string
    endTime?: StringFieldUpdateOperationsInput | string
    persons?: NullableIntFieldUpdateOperationsInput | number | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumBookingStatusFieldUpdateOperationsInput | $Enums.BookingStatus
    sellerNote?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    space?: SpaceUpdateOneRequiredWithoutBookingsNestedInput
  }

  export type BookingUncheckedUpdateWithoutBuyerInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: StringFieldUpdateOperationsInput | string
    startTime?: StringFieldUpdateOperationsInput | string
    endTime?: StringFieldUpdateOperationsInput | string
    persons?: NullableIntFieldUpdateOperationsInput | number | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumBookingStatusFieldUpdateOperationsInput | $Enums.BookingStatus
    sellerNote?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    spaceId?: StringFieldUpdateOperationsInput | string
  }

  export type BookingUncheckedUpdateManyWithoutBuyerInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: StringFieldUpdateOperationsInput | string
    startTime?: StringFieldUpdateOperationsInput | string
    endTime?: StringFieldUpdateOperationsInput | string
    persons?: NullableIntFieldUpdateOperationsInput | number | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumBookingStatusFieldUpdateOperationsInput | $Enums.BookingStatus
    sellerNote?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    spaceId?: StringFieldUpdateOperationsInput | string
  }

  export type SpaceCreateManyTypeInput = {
    id?: string
    name: string
    description?: string | null
    city: string
    district?: string | null
    address?: string | null
    capacity?: number | null
    price: number
    pricePeriod?: string
    status?: $Enums.SpaceStatus
    adminNotes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    sellerId: string
  }

  export type SpaceUpdateWithoutTypeInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    city?: StringFieldUpdateOperationsInput | string
    district?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    capacity?: NullableIntFieldUpdateOperationsInput | number | null
    price?: FloatFieldUpdateOperationsInput | number
    pricePeriod?: StringFieldUpdateOperationsInput | string
    status?: EnumSpaceStatusFieldUpdateOperationsInput | $Enums.SpaceStatus
    adminNotes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    seller?: UserUpdateOneRequiredWithoutSpacesNestedInput
    images?: SpaceImageUpdateManyWithoutSpaceNestedInput
    amenities?: SpaceAmenityUpdateManyWithoutSpaceNestedInput
    bookings?: BookingUpdateManyWithoutSpaceNestedInput
  }

  export type SpaceUncheckedUpdateWithoutTypeInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    city?: StringFieldUpdateOperationsInput | string
    district?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    capacity?: NullableIntFieldUpdateOperationsInput | number | null
    price?: FloatFieldUpdateOperationsInput | number
    pricePeriod?: StringFieldUpdateOperationsInput | string
    status?: EnumSpaceStatusFieldUpdateOperationsInput | $Enums.SpaceStatus
    adminNotes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sellerId?: StringFieldUpdateOperationsInput | string
    images?: SpaceImageUncheckedUpdateManyWithoutSpaceNestedInput
    amenities?: SpaceAmenityUncheckedUpdateManyWithoutSpaceNestedInput
    bookings?: BookingUncheckedUpdateManyWithoutSpaceNestedInput
  }

  export type SpaceUncheckedUpdateManyWithoutTypeInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    city?: StringFieldUpdateOperationsInput | string
    district?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    capacity?: NullableIntFieldUpdateOperationsInput | number | null
    price?: FloatFieldUpdateOperationsInput | number
    pricePeriod?: StringFieldUpdateOperationsInput | string
    status?: EnumSpaceStatusFieldUpdateOperationsInput | $Enums.SpaceStatus
    adminNotes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sellerId?: StringFieldUpdateOperationsInput | string
  }

  export type SpaceAmenityCreateManyAmenityInput = {
    spaceId: string
  }

  export type SpaceAmenityUpdateWithoutAmenityInput = {
    space?: SpaceUpdateOneRequiredWithoutAmenitiesNestedInput
  }

  export type SpaceAmenityUncheckedUpdateWithoutAmenityInput = {
    spaceId?: StringFieldUpdateOperationsInput | string
  }

  export type SpaceAmenityUncheckedUpdateManyWithoutAmenityInput = {
    spaceId?: StringFieldUpdateOperationsInput | string
  }

  export type SpaceImageCreateManySpaceInput = {
    id?: string
    url: string
    order?: number
  }

  export type SpaceAmenityCreateManySpaceInput = {
    amenityId: string
  }

  export type BookingCreateManySpaceInput = {
    id?: string
    date: string
    startTime: string
    endTime: string
    persons?: number | null
    notes?: string | null
    status?: $Enums.BookingStatus
    sellerNote?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    buyerId: string
  }

  export type SpaceImageUpdateWithoutSpaceInput = {
    id?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
  }

  export type SpaceImageUncheckedUpdateWithoutSpaceInput = {
    id?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
  }

  export type SpaceImageUncheckedUpdateManyWithoutSpaceInput = {
    id?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
  }

  export type SpaceAmenityUpdateWithoutSpaceInput = {
    amenity?: AmenityUpdateOneRequiredWithoutSpacesNestedInput
  }

  export type SpaceAmenityUncheckedUpdateWithoutSpaceInput = {
    amenityId?: StringFieldUpdateOperationsInput | string
  }

  export type SpaceAmenityUncheckedUpdateManyWithoutSpaceInput = {
    amenityId?: StringFieldUpdateOperationsInput | string
  }

  export type BookingUpdateWithoutSpaceInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: StringFieldUpdateOperationsInput | string
    startTime?: StringFieldUpdateOperationsInput | string
    endTime?: StringFieldUpdateOperationsInput | string
    persons?: NullableIntFieldUpdateOperationsInput | number | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumBookingStatusFieldUpdateOperationsInput | $Enums.BookingStatus
    sellerNote?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    buyer?: UserUpdateOneRequiredWithoutBookingsNestedInput
  }

  export type BookingUncheckedUpdateWithoutSpaceInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: StringFieldUpdateOperationsInput | string
    startTime?: StringFieldUpdateOperationsInput | string
    endTime?: StringFieldUpdateOperationsInput | string
    persons?: NullableIntFieldUpdateOperationsInput | number | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumBookingStatusFieldUpdateOperationsInput | $Enums.BookingStatus
    sellerNote?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    buyerId?: StringFieldUpdateOperationsInput | string
  }

  export type BookingUncheckedUpdateManyWithoutSpaceInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: StringFieldUpdateOperationsInput | string
    startTime?: StringFieldUpdateOperationsInput | string
    endTime?: StringFieldUpdateOperationsInput | string
    persons?: NullableIntFieldUpdateOperationsInput | number | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumBookingStatusFieldUpdateOperationsInput | $Enums.BookingStatus
    sellerNote?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    buyerId?: StringFieldUpdateOperationsInput | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}