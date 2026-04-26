import type { QueryKey, UseMutationOptions, UseMutationResult, UseQueryOptions, UseQueryResult } from "@tanstack/react-query";
import type { Admin, AdminDashboard, AdminLoginBody, AssignRiderBody, BroadcastBody, CreateOrderBody, ErrorResponse, FanSession, FeedEvent, GetAdminOrdersParams, GetTrendingItemsParams, HalftimeBody, HalftimePromo, HealthStatus, HeatmapCell, ListStandsParams, LiveMatch, MenuItem, NotificationLog, Order, RateOrderBody, Rider, RiderLoginBody, RiderStats, ScanTicketBody, Stadium, Stand, TrendingItem, UpdateOrderStatusBody, UpdateStandStatusBody } from "./api.schemas";
import { customFetch } from "../custom-fetch";
import type { ErrorType, BodyType } from "../custom-fetch";
type AwaitedInput<T> = PromiseLike<T> | T;
type Awaited<O> = O extends AwaitedInput<infer T> ? T : never;
type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1];
/**
 * @summary Health check
 */
export declare const getHealthCheckUrl: () => string;
export declare const healthCheck: (options?: RequestInit) => Promise<HealthStatus>;
export declare const getHealthCheckQueryKey: () => readonly ["/api/healthz"];
export declare const getHealthCheckQueryOptions: <TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData> & {
    queryKey: QueryKey;
};
export type HealthCheckQueryResult = NonNullable<Awaited<ReturnType<typeof healthCheck>>>;
export type HealthCheckQueryError = ErrorType<unknown>;
/**
 * @summary Health check
 */
export declare function useHealthCheck<TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Validate a stadium ticket QR and create a fan session
 */
export declare const getScanTicketUrl: () => string;
export declare const scanTicket: (scanTicketBody: ScanTicketBody, options?: RequestInit) => Promise<FanSession>;
export declare const getScanTicketMutationOptions: <TError = ErrorType<ErrorResponse>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof scanTicket>>, TError, {
        data: BodyType<ScanTicketBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof scanTicket>>, TError, {
    data: BodyType<ScanTicketBody>;
}, TContext>;
export type ScanTicketMutationResult = NonNullable<Awaited<ReturnType<typeof scanTicket>>>;
export type ScanTicketMutationBody = BodyType<ScanTicketBody>;
export type ScanTicketMutationError = ErrorType<ErrorResponse>;
/**
 * @summary Validate a stadium ticket QR and create a fan session
 */
export declare const useScanTicket: <TError = ErrorType<ErrorResponse>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof scanTicket>>, TError, {
        data: BodyType<ScanTicketBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof scanTicket>>, TError, {
    data: BodyType<ScanTicketBody>;
}, TContext>;
/**
 * @summary Get a fan session by id
 */
export declare const getGetSessionUrl: (sessionId: string) => string;
export declare const getSession: (sessionId: string, options?: RequestInit) => Promise<FanSession>;
export declare const getGetSessionQueryKey: (sessionId: string) => readonly [`/api/session/${string}`];
export declare const getGetSessionQueryOptions: <TData = Awaited<ReturnType<typeof getSession>>, TError = ErrorType<unknown>>(sessionId: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getSession>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getSession>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetSessionQueryResult = NonNullable<Awaited<ReturnType<typeof getSession>>>;
export type GetSessionQueryError = ErrorType<unknown>;
/**
 * @summary Get a fan session by id
 */
export declare function useGetSession<TData = Awaited<ReturnType<typeof getSession>>, TError = ErrorType<unknown>>(sessionId: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getSession>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary List all stadiums
 */
export declare const getListStadiumsUrl: () => string;
export declare const listStadiums: (options?: RequestInit) => Promise<Stadium[]>;
export declare const getListStadiumsQueryKey: () => readonly ["/api/stadiums"];
export declare const getListStadiumsQueryOptions: <TData = Awaited<ReturnType<typeof listStadiums>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listStadiums>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listStadiums>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListStadiumsQueryResult = NonNullable<Awaited<ReturnType<typeof listStadiums>>>;
export type ListStadiumsQueryError = ErrorType<unknown>;
/**
 * @summary List all stadiums
 */
export declare function useListStadiums<TData = Awaited<ReturnType<typeof listStadiums>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listStadiums>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Get a stadium with its sections
 */
export declare const getGetStadiumUrl: (stadiumId: string) => string;
export declare const getStadium: (stadiumId: string, options?: RequestInit) => Promise<Stadium>;
export declare const getGetStadiumQueryKey: (stadiumId: string) => readonly [`/api/stadiums/${string}`];
export declare const getGetStadiumQueryOptions: <TData = Awaited<ReturnType<typeof getStadium>>, TError = ErrorType<unknown>>(stadiumId: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getStadium>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getStadium>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetStadiumQueryResult = NonNullable<Awaited<ReturnType<typeof getStadium>>>;
export type GetStadiumQueryError = ErrorType<unknown>;
/**
 * @summary Get a stadium with its sections
 */
export declare function useGetStadium<TData = Awaited<ReturnType<typeof getStadium>>, TError = ErrorType<unknown>>(stadiumId: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getStadium>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary List stands in a stadium with live wait times
 */
export declare const getListStandsUrl: (stadiumId: string, params?: ListStandsParams) => string;
export declare const listStands: (stadiumId: string, params?: ListStandsParams, options?: RequestInit) => Promise<Stand[]>;
export declare const getListStandsQueryKey: (stadiumId: string, params?: ListStandsParams) => readonly [`/api/stadiums/${string}/stands`, ...ListStandsParams[]];
export declare const getListStandsQueryOptions: <TData = Awaited<ReturnType<typeof listStands>>, TError = ErrorType<unknown>>(stadiumId: string, params?: ListStandsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listStands>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listStands>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListStandsQueryResult = NonNullable<Awaited<ReturnType<typeof listStands>>>;
export type ListStandsQueryError = ErrorType<unknown>;
/**
 * @summary List stands in a stadium with live wait times
 */
export declare function useListStands<TData = Awaited<ReturnType<typeof listStands>>, TError = ErrorType<unknown>>(stadiumId: string, params?: ListStandsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listStands>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Trending items in a stadium right now
 */
export declare const getGetTrendingItemsUrl: (stadiumId: string, params?: GetTrendingItemsParams) => string;
export declare const getTrendingItems: (stadiumId: string, params?: GetTrendingItemsParams, options?: RequestInit) => Promise<TrendingItem[]>;
export declare const getGetTrendingItemsQueryKey: (stadiumId: string, params?: GetTrendingItemsParams) => readonly [`/api/stadiums/${string}/trending`, ...GetTrendingItemsParams[]];
export declare const getGetTrendingItemsQueryOptions: <TData = Awaited<ReturnType<typeof getTrendingItems>>, TError = ErrorType<unknown>>(stadiumId: string, params?: GetTrendingItemsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getTrendingItems>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getTrendingItems>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetTrendingItemsQueryResult = NonNullable<Awaited<ReturnType<typeof getTrendingItems>>>;
export type GetTrendingItemsQueryError = ErrorType<unknown>;
/**
 * @summary Trending items in a stadium right now
 */
export declare function useGetTrendingItems<TData = Awaited<ReturnType<typeof getTrendingItems>>, TError = ErrorType<unknown>>(stadiumId: string, params?: GetTrendingItemsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getTrendingItems>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Live "fans near you are ordering" feed for a stadium
 */
export declare const getGetStadiumFeedUrl: (stadiumId: string) => string;
export declare const getStadiumFeed: (stadiumId: string, options?: RequestInit) => Promise<FeedEvent[]>;
export declare const getGetStadiumFeedQueryKey: (stadiumId: string) => readonly [`/api/stadiums/${string}/feed`];
export declare const getGetStadiumFeedQueryOptions: <TData = Awaited<ReturnType<typeof getStadiumFeed>>, TError = ErrorType<unknown>>(stadiumId: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getStadiumFeed>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getStadiumFeed>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetStadiumFeedQueryResult = NonNullable<Awaited<ReturnType<typeof getStadiumFeed>>>;
export type GetStadiumFeedQueryError = ErrorType<unknown>;
/**
 * @summary Live "fans near you are ordering" feed for a stadium
 */
export declare function useGetStadiumFeed<TData = Awaited<ReturnType<typeof getStadiumFeed>>, TError = ErrorType<unknown>>(stadiumId: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getStadiumFeed>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Live match ticker for a stadium
 */
export declare const getGetLiveMatchUrl: (stadiumId: string) => string;
export declare const getLiveMatch: (stadiumId: string, options?: RequestInit) => Promise<LiveMatch>;
export declare const getGetLiveMatchQueryKey: (stadiumId: string) => readonly [`/api/stadiums/${string}/match`];
export declare const getGetLiveMatchQueryOptions: <TData = Awaited<ReturnType<typeof getLiveMatch>>, TError = ErrorType<unknown>>(stadiumId: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getLiveMatch>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getLiveMatch>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetLiveMatchQueryResult = NonNullable<Awaited<ReturnType<typeof getLiveMatch>>>;
export type GetLiveMatchQueryError = ErrorType<unknown>;
/**
 * @summary Live match ticker for a stadium
 */
export declare function useGetLiveMatch<TData = Awaited<ReturnType<typeof getLiveMatch>>, TError = ErrorType<unknown>>(stadiumId: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getLiveMatch>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Get a single stand
 */
export declare const getGetStandUrl: (standId: string) => string;
export declare const getStand: (standId: string, options?: RequestInit) => Promise<Stand>;
export declare const getGetStandQueryKey: (standId: string) => readonly [`/api/stands/${string}`];
export declare const getGetStandQueryOptions: <TData = Awaited<ReturnType<typeof getStand>>, TError = ErrorType<unknown>>(standId: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getStand>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getStand>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetStandQueryResult = NonNullable<Awaited<ReturnType<typeof getStand>>>;
export type GetStandQueryError = ErrorType<unknown>;
/**
 * @summary Get a single stand
 */
export declare function useGetStand<TData = Awaited<ReturnType<typeof getStand>>, TError = ErrorType<unknown>>(standId: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getStand>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Get a stand's menu
 */
export declare const getGetStandMenuUrl: (standId: string) => string;
export declare const getStandMenu: (standId: string, options?: RequestInit) => Promise<MenuItem[]>;
export declare const getGetStandMenuQueryKey: (standId: string) => readonly [`/api/stands/${string}/menu`];
export declare const getGetStandMenuQueryOptions: <TData = Awaited<ReturnType<typeof getStandMenu>>, TError = ErrorType<unknown>>(standId: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getStandMenu>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getStandMenu>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetStandMenuQueryResult = NonNullable<Awaited<ReturnType<typeof getStandMenu>>>;
export type GetStandMenuQueryError = ErrorType<unknown>;
/**
 * @summary Get a stand's menu
 */
export declare function useGetStandMenu<TData = Awaited<ReturnType<typeof getStandMenu>>, TError = ErrorType<unknown>>(standId: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getStandMenu>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Create a new order
 */
export declare const getCreateOrderUrl: () => string;
export declare const createOrder: (createOrderBody: CreateOrderBody, options?: RequestInit) => Promise<Order>;
export declare const getCreateOrderMutationOptions: <TError = ErrorType<ErrorResponse>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createOrder>>, TError, {
        data: BodyType<CreateOrderBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createOrder>>, TError, {
    data: BodyType<CreateOrderBody>;
}, TContext>;
export type CreateOrderMutationResult = NonNullable<Awaited<ReturnType<typeof createOrder>>>;
export type CreateOrderMutationBody = BodyType<CreateOrderBody>;
export type CreateOrderMutationError = ErrorType<ErrorResponse>;
/**
 * @summary Create a new order
 */
export declare const useCreateOrder: <TError = ErrorType<ErrorResponse>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createOrder>>, TError, {
        data: BodyType<CreateOrderBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createOrder>>, TError, {
    data: BodyType<CreateOrderBody>;
}, TContext>;
/**
 * @summary List orders for a fan session
 */
export declare const getListSessionOrdersUrl: (sessionId: string) => string;
export declare const listSessionOrders: (sessionId: string, options?: RequestInit) => Promise<Order[]>;
export declare const getListSessionOrdersQueryKey: (sessionId: string) => readonly [`/api/orders/session/${string}`];
export declare const getListSessionOrdersQueryOptions: <TData = Awaited<ReturnType<typeof listSessionOrders>>, TError = ErrorType<unknown>>(sessionId: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listSessionOrders>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listSessionOrders>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListSessionOrdersQueryResult = NonNullable<Awaited<ReturnType<typeof listSessionOrders>>>;
export type ListSessionOrdersQueryError = ErrorType<unknown>;
/**
 * @summary List orders for a fan session
 */
export declare function useListSessionOrders<TData = Awaited<ReturnType<typeof listSessionOrders>>, TError = ErrorType<unknown>>(sessionId: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listSessionOrders>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Get an order
 */
export declare const getGetOrderUrl: (orderId: string) => string;
export declare const getOrder: (orderId: string, options?: RequestInit) => Promise<Order>;
export declare const getGetOrderQueryKey: (orderId: string) => readonly [`/api/orders/${string}`];
export declare const getGetOrderQueryOptions: <TData = Awaited<ReturnType<typeof getOrder>>, TError = ErrorType<unknown>>(orderId: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getOrder>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getOrder>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetOrderQueryResult = NonNullable<Awaited<ReturnType<typeof getOrder>>>;
export type GetOrderQueryError = ErrorType<unknown>;
/**
 * @summary Get an order
 */
export declare function useGetOrder<TData = Awaited<ReturnType<typeof getOrder>>, TError = ErrorType<unknown>>(orderId: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getOrder>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Rate a delivered order
 */
export declare const getRateOrderUrl: (orderId: string) => string;
export declare const rateOrder: (orderId: string, rateOrderBody: RateOrderBody, options?: RequestInit) => Promise<Order>;
export declare const getRateOrderMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof rateOrder>>, TError, {
        orderId: string;
        data: BodyType<RateOrderBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof rateOrder>>, TError, {
    orderId: string;
    data: BodyType<RateOrderBody>;
}, TContext>;
export type RateOrderMutationResult = NonNullable<Awaited<ReturnType<typeof rateOrder>>>;
export type RateOrderMutationBody = BodyType<RateOrderBody>;
export type RateOrderMutationError = ErrorType<unknown>;
/**
 * @summary Rate a delivered order
 */
export declare const useRateOrder: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof rateOrder>>, TError, {
        orderId: string;
        data: BodyType<RateOrderBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof rateOrder>>, TError, {
    orderId: string;
    data: BodyType<RateOrderBody>;
}, TContext>;
/**
 * @summary Rider PIN login
 */
export declare const getRiderLoginUrl: () => string;
export declare const riderLogin: (riderLoginBody: RiderLoginBody, options?: RequestInit) => Promise<Rider>;
export declare const getRiderLoginMutationOptions: <TError = ErrorType<ErrorResponse>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof riderLogin>>, TError, {
        data: BodyType<RiderLoginBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof riderLogin>>, TError, {
    data: BodyType<RiderLoginBody>;
}, TContext>;
export type RiderLoginMutationResult = NonNullable<Awaited<ReturnType<typeof riderLogin>>>;
export type RiderLoginMutationBody = BodyType<RiderLoginBody>;
export type RiderLoginMutationError = ErrorType<ErrorResponse>;
/**
 * @summary Rider PIN login
 */
export declare const useRiderLogin: <TError = ErrorType<ErrorResponse>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof riderLogin>>, TError, {
        data: BodyType<RiderLoginBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof riderLogin>>, TError, {
    data: BodyType<RiderLoginBody>;
}, TContext>;
/**
 * @summary Orders assigned to a rider
 */
export declare const getGetRiderOrdersUrl: (riderId: string) => string;
export declare const getRiderOrders: (riderId: string, options?: RequestInit) => Promise<Order[]>;
export declare const getGetRiderOrdersQueryKey: (riderId: string) => readonly [`/api/rider/${string}/orders`];
export declare const getGetRiderOrdersQueryOptions: <TData = Awaited<ReturnType<typeof getRiderOrders>>, TError = ErrorType<unknown>>(riderId: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getRiderOrders>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getRiderOrders>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetRiderOrdersQueryResult = NonNullable<Awaited<ReturnType<typeof getRiderOrders>>>;
export type GetRiderOrdersQueryError = ErrorType<unknown>;
/**
 * @summary Orders assigned to a rider
 */
export declare function useGetRiderOrders<TData = Awaited<ReturnType<typeof getRiderOrders>>, TError = ErrorType<unknown>>(riderId: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getRiderOrders>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary A rider's day-of stats (deliveries, avg time)
 */
export declare const getGetRiderStatsUrl: (riderId: string) => string;
export declare const getRiderStats: (riderId: string, options?: RequestInit) => Promise<RiderStats>;
export declare const getGetRiderStatsQueryKey: (riderId: string) => readonly [`/api/rider/${string}/stats`];
export declare const getGetRiderStatsQueryOptions: <TData = Awaited<ReturnType<typeof getRiderStats>>, TError = ErrorType<unknown>>(riderId: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getRiderStats>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getRiderStats>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetRiderStatsQueryResult = NonNullable<Awaited<ReturnType<typeof getRiderStats>>>;
export type GetRiderStatsQueryError = ErrorType<unknown>;
/**
 * @summary A rider's day-of stats (deliveries, avg time)
 */
export declare function useGetRiderStats<TData = Awaited<ReturnType<typeof getRiderStats>>, TError = ErrorType<unknown>>(riderId: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getRiderStats>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Update an order's status
 */
export declare const getUpdateOrderStatusUrl: (orderId: string) => string;
export declare const updateOrderStatus: (orderId: string, updateOrderStatusBody: UpdateOrderStatusBody, options?: RequestInit) => Promise<Order>;
export declare const getUpdateOrderStatusMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateOrderStatus>>, TError, {
        orderId: string;
        data: BodyType<UpdateOrderStatusBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateOrderStatus>>, TError, {
    orderId: string;
    data: BodyType<UpdateOrderStatusBody>;
}, TContext>;
export type UpdateOrderStatusMutationResult = NonNullable<Awaited<ReturnType<typeof updateOrderStatus>>>;
export type UpdateOrderStatusMutationBody = BodyType<UpdateOrderStatusBody>;
export type UpdateOrderStatusMutationError = ErrorType<unknown>;
/**
 * @summary Update an order's status
 */
export declare const useUpdateOrderStatus: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateOrderStatus>>, TError, {
        orderId: string;
        data: BodyType<UpdateOrderStatusBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updateOrderStatus>>, TError, {
    orderId: string;
    data: BodyType<UpdateOrderStatusBody>;
}, TContext>;
/**
 * @summary Admin login
 */
export declare const getAdminLoginUrl: () => string;
export declare const adminLogin: (adminLoginBody: AdminLoginBody, options?: RequestInit) => Promise<Admin>;
export declare const getAdminLoginMutationOptions: <TError = ErrorType<ErrorResponse>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof adminLogin>>, TError, {
        data: BodyType<AdminLoginBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof adminLogin>>, TError, {
    data: BodyType<AdminLoginBody>;
}, TContext>;
export type AdminLoginMutationResult = NonNullable<Awaited<ReturnType<typeof adminLogin>>>;
export type AdminLoginMutationBody = BodyType<AdminLoginBody>;
export type AdminLoginMutationError = ErrorType<ErrorResponse>;
/**
 * @summary Admin login
 */
export declare const useAdminLogin: <TError = ErrorType<ErrorResponse>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof adminLogin>>, TError, {
        data: BodyType<AdminLoginBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof adminLogin>>, TError, {
    data: BodyType<AdminLoginBody>;
}, TContext>;
/**
 * @summary Admin KPIs and live overview for a stadium
 */
export declare const getGetAdminDashboardUrl: (stadiumId: string) => string;
export declare const getAdminDashboard: (stadiumId: string, options?: RequestInit) => Promise<AdminDashboard>;
export declare const getGetAdminDashboardQueryKey: (stadiumId: string) => readonly [`/api/admin/${string}/dashboard`];
export declare const getGetAdminDashboardQueryOptions: <TData = Awaited<ReturnType<typeof getAdminDashboard>>, TError = ErrorType<unknown>>(stadiumId: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getAdminDashboard>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getAdminDashboard>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetAdminDashboardQueryResult = NonNullable<Awaited<ReturnType<typeof getAdminDashboard>>>;
export type GetAdminDashboardQueryError = ErrorType<unknown>;
/**
 * @summary Admin KPIs and live overview for a stadium
 */
export declare function useGetAdminDashboard<TData = Awaited<ReturnType<typeof getAdminDashboard>>, TError = ErrorType<unknown>>(stadiumId: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getAdminDashboard>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Live order queue for the stadium
 */
export declare const getGetAdminOrdersUrl: (stadiumId: string, params?: GetAdminOrdersParams) => string;
export declare const getAdminOrders: (stadiumId: string, params?: GetAdminOrdersParams, options?: RequestInit) => Promise<Order[]>;
export declare const getGetAdminOrdersQueryKey: (stadiumId: string, params?: GetAdminOrdersParams) => readonly [`/api/admin/${string}/orders`, ...GetAdminOrdersParams[]];
export declare const getGetAdminOrdersQueryOptions: <TData = Awaited<ReturnType<typeof getAdminOrders>>, TError = ErrorType<unknown>>(stadiumId: string, params?: GetAdminOrdersParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getAdminOrders>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getAdminOrders>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetAdminOrdersQueryResult = NonNullable<Awaited<ReturnType<typeof getAdminOrders>>>;
export type GetAdminOrdersQueryError = ErrorType<unknown>;
/**
 * @summary Live order queue for the stadium
 */
export declare function useGetAdminOrders<TData = Awaited<ReturnType<typeof getAdminOrders>>, TError = ErrorType<unknown>>(stadiumId: string, params?: GetAdminOrdersParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getAdminOrders>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary All riders for the stadium with status
 */
export declare const getGetAdminRidersUrl: (stadiumId: string) => string;
export declare const getAdminRiders: (stadiumId: string, options?: RequestInit) => Promise<Rider[]>;
export declare const getGetAdminRidersQueryKey: (stadiumId: string) => readonly [`/api/admin/${string}/riders`];
export declare const getGetAdminRidersQueryOptions: <TData = Awaited<ReturnType<typeof getAdminRiders>>, TError = ErrorType<unknown>>(stadiumId: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getAdminRiders>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getAdminRiders>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetAdminRidersQueryResult = NonNullable<Awaited<ReturnType<typeof getAdminRiders>>>;
export type GetAdminRidersQueryError = ErrorType<unknown>;
/**
 * @summary All riders for the stadium with status
 */
export declare function useGetAdminRiders<TData = Awaited<ReturnType<typeof getAdminRiders>>, TError = ErrorType<unknown>>(stadiumId: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getAdminRiders>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Update stand status (open/temp_closed/closed)
 */
export declare const getUpdateStandStatusUrl: (standId: string) => string;
export declare const updateStandStatus: (standId: string, updateStandStatusBody: UpdateStandStatusBody, options?: RequestInit) => Promise<Stand>;
export declare const getUpdateStandStatusMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateStandStatus>>, TError, {
        standId: string;
        data: BodyType<UpdateStandStatusBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateStandStatus>>, TError, {
    standId: string;
    data: BodyType<UpdateStandStatusBody>;
}, TContext>;
export type UpdateStandStatusMutationResult = NonNullable<Awaited<ReturnType<typeof updateStandStatus>>>;
export type UpdateStandStatusMutationBody = BodyType<UpdateStandStatusBody>;
export type UpdateStandStatusMutationError = ErrorType<unknown>;
/**
 * @summary Update stand status (open/temp_closed/closed)
 */
export declare const useUpdateStandStatus: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateStandStatus>>, TError, {
        standId: string;
        data: BodyType<UpdateStandStatusBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updateStandStatus>>, TError, {
    standId: string;
    data: BodyType<UpdateStandStatusBody>;
}, TContext>;
/**
 * @summary Assign or reassign a rider to an order
 */
export declare const getAssignOrderRiderUrl: (orderId: string) => string;
export declare const assignOrderRider: (orderId: string, assignRiderBody: AssignRiderBody, options?: RequestInit) => Promise<Order>;
export declare const getAssignOrderRiderMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof assignOrderRider>>, TError, {
        orderId: string;
        data: BodyType<AssignRiderBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof assignOrderRider>>, TError, {
    orderId: string;
    data: BodyType<AssignRiderBody>;
}, TContext>;
export type AssignOrderRiderMutationResult = NonNullable<Awaited<ReturnType<typeof assignOrderRider>>>;
export type AssignOrderRiderMutationBody = BodyType<AssignRiderBody>;
export type AssignOrderRiderMutationError = ErrorType<unknown>;
/**
 * @summary Assign or reassign a rider to an order
 */
export declare const useAssignOrderRider: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof assignOrderRider>>, TError, {
        orderId: string;
        data: BodyType<AssignRiderBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof assignOrderRider>>, TError, {
    orderId: string;
    data: BodyType<AssignRiderBody>;
}, TContext>;
/**
 * @summary Broadcast a notification to fans in a stadium section
 */
export declare const getBroadcastNotificationUrl: (stadiumId: string) => string;
export declare const broadcastNotification: (stadiumId: string, broadcastBody: BroadcastBody, options?: RequestInit) => Promise<NotificationLog>;
export declare const getBroadcastNotificationMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof broadcastNotification>>, TError, {
        stadiumId: string;
        data: BodyType<BroadcastBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof broadcastNotification>>, TError, {
    stadiumId: string;
    data: BodyType<BroadcastBody>;
}, TContext>;
export type BroadcastNotificationMutationResult = NonNullable<Awaited<ReturnType<typeof broadcastNotification>>>;
export type BroadcastNotificationMutationBody = BodyType<BroadcastBody>;
export type BroadcastNotificationMutationError = ErrorType<unknown>;
/**
 * @summary Broadcast a notification to fans in a stadium section
 */
export declare const useBroadcastNotification: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof broadcastNotification>>, TError, {
        stadiumId: string;
        data: BodyType<BroadcastBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof broadcastNotification>>, TError, {
    stadiumId: string;
    data: BodyType<BroadcastBody>;
}, TContext>;
/**
 * @summary Recent broadcasts for the stadium
 */
export declare const getListBroadcastsUrl: (stadiumId: string) => string;
export declare const listBroadcasts: (stadiumId: string, options?: RequestInit) => Promise<NotificationLog[]>;
export declare const getListBroadcastsQueryKey: (stadiumId: string) => readonly [`/api/admin/${string}/broadcasts`];
export declare const getListBroadcastsQueryOptions: <TData = Awaited<ReturnType<typeof listBroadcasts>>, TError = ErrorType<unknown>>(stadiumId: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listBroadcasts>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listBroadcasts>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListBroadcastsQueryResult = NonNullable<Awaited<ReturnType<typeof listBroadcasts>>>;
export type ListBroadcastsQueryError = ErrorType<unknown>;
/**
 * @summary Recent broadcasts for the stadium
 */
export declare function useListBroadcasts<TData = Awaited<ReturnType<typeof listBroadcasts>>, TError = ErrorType<unknown>>(stadiumId: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listBroadcasts>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Heatmap of orders by stadium section
 */
export declare const getGetOrderHeatmapUrl: (stadiumId: string) => string;
export declare const getOrderHeatmap: (stadiumId: string, options?: RequestInit) => Promise<HeatmapCell[]>;
export declare const getGetOrderHeatmapQueryKey: (stadiumId: string) => readonly [`/api/admin/${string}/heatmap`];
export declare const getGetOrderHeatmapQueryOptions: <TData = Awaited<ReturnType<typeof getOrderHeatmap>>, TError = ErrorType<unknown>>(stadiumId: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getOrderHeatmap>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getOrderHeatmap>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetOrderHeatmapQueryResult = NonNullable<Awaited<ReturnType<typeof getOrderHeatmap>>>;
export type GetOrderHeatmapQueryError = ErrorType<unknown>;
/**
 * @summary Heatmap of orders by stadium section
 */
export declare function useGetOrderHeatmap<TData = Awaited<ReturnType<typeof getOrderHeatmap>>, TError = ErrorType<unknown>>(stadiumId: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getOrderHeatmap>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Trigger or end "Half-Time Rush" mode with a featured item
 */
export declare const getTriggerHalftimeModeUrl: (stadiumId: string) => string;
export declare const triggerHalftimeMode: (stadiumId: string, halftimeBody: HalftimeBody, options?: RequestInit) => Promise<HalftimePromo>;
export declare const getTriggerHalftimeModeMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof triggerHalftimeMode>>, TError, {
        stadiumId: string;
        data: BodyType<HalftimeBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof triggerHalftimeMode>>, TError, {
    stadiumId: string;
    data: BodyType<HalftimeBody>;
}, TContext>;
export type TriggerHalftimeModeMutationResult = NonNullable<Awaited<ReturnType<typeof triggerHalftimeMode>>>;
export type TriggerHalftimeModeMutationBody = BodyType<HalftimeBody>;
export type TriggerHalftimeModeMutationError = ErrorType<unknown>;
/**
 * @summary Trigger or end "Half-Time Rush" mode with a featured item
 */
export declare const useTriggerHalftimeMode: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof triggerHalftimeMode>>, TError, {
        stadiumId: string;
        data: BodyType<HalftimeBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof triggerHalftimeMode>>, TError, {
    stadiumId: string;
    data: BodyType<HalftimeBody>;
}, TContext>;
export {};
//# sourceMappingURL=api.d.ts.map