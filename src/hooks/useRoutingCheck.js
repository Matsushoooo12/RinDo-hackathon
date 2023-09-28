import { useRouter } from "next/router";

export const useRoutingCheck = () => {
  const router = useRouter();
  const { groupId, projectId, userId } = router.query;

  // URLのチェックをする関数
  const homeUrl = () => {
    return router.asPath === `/`;
  };
  const groupDashboardUrl = () => {
    return router.asPath === `/groups/${groupId}/dashboard`;
  };
  const groupProjectsUrl = () => {
    return router.asPath === `/groups/${groupId}/projects`;
  };
  const groupLibraryUrl = () => {
    return router.asPath === `/groups/${groupId}/library`;
  };
  const groupMemberUrl = () => {
    return router.asPath === `/groups/${groupId}/members`;
  };
  const groupCalendarUrl = () => {
    return router.asPath === `/groups/${groupId}/calendar`;
  };
  const groupSettingUrl = () => {
    return router.asPath === `/groups/${groupId}/setting`;
  };
  const groupProjectUrl = () => {
    return router.asPath === `/groups/${groupId}/projects/${projectId}`;
  };
  const profileUrl = () => {
    return router.asPath === `/profile/${userId}`;
  };
  const shopUrl = () => {
    return router.asPath === `/shop`;
  };
  const rankingUrl = () => {
    return router.asPath === `/ranking`;
  };
  const planUrl = () => {
    return router.asPath === `/plan`;
  };
  const aboutUrl = () => {
    return router.asPath === `/about`;
  };
  const signupUrl = () => {
    return router.asPath === `/signup`;
  };
  const dashboardDictionaryUrl = () => {
    return router.asPath === `/dashboard/dictionary`;
  };
  const dashboardLibraryUrl = () => {
    return router.asPath === `/dashboard/library`;
  };
  const dashboardParticipatingUrl = () => {
    return router.asPath === `/dashboard/participating`;
  };
  const dashboardPaymentUrl = () => {
    return router.asPath === `/dashboard/payment`;
  };
  const startGroupUrl = () => {
    if (router.pathname.startsWith("/groups")) {
      return true;
    } else {
      return false;
    }
  };
  return {
    homeUrl,
    groupDashboardUrl,
    groupMemberUrl,
    groupProjectsUrl,
    groupLibraryUrl,
    groupCalendarUrl,
    groupSettingUrl,
    groupProjectUrl,
    profileUrl,
    shopUrl,
    rankingUrl,
    planUrl,
    aboutUrl,
    signupUrl,
    startGroupUrl,
  };
};
