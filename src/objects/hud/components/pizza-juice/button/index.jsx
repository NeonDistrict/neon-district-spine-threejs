import React from "react";

import * as S from "./styles";

/**
 * Button component
 *
 * @description used to trigger an action or event.
 */
export const Button = () => {
  const {
    type = "button",
    icon,
    iconPosition = "left",
    loading,
    children,
    ...rest
  } = props;

  return (
    <S.Button
      ref={ref}
      type={type}
      onlyIcon={!!icon && !children}
      loading={loading}
      {...rest}
    >
      {icon && iconPosition === "left" && icon}

      {children && <span>{children}</span>}

      {loading && <S.Spinner />}

      {icon && iconPosition === "right" && icon}
    </S.Button>
  );
};
