export const BackFn = navigation => {
  return {
    isBack: navigation.canGoBack(),
    BackFn: navigation.goBack,
  };
};
