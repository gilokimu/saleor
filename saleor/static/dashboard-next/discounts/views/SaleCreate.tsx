import React from "react";

import { WindowTitle } from "@saleor/components/WindowTitle";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import useShop from "@saleor/hooks/useShop";
import i18n from "../../i18n";
import { decimal, getMutationState, maybe } from "../../misc";
import { DiscountValueTypeEnum, SaleType } from "../../types/globalTypes";
import SaleCreatePage from "../components/SaleCreatePage";
import { TypedSaleCreate } from "../mutations";
import { SaleCreate } from "../types/SaleCreate";
import { saleListUrl, saleUrl } from "../urls";

function discountValueTypeEnum(type: SaleType): DiscountValueTypeEnum {
  return type.toString() === DiscountValueTypeEnum.FIXED
    ? DiscountValueTypeEnum.FIXED
    : DiscountValueTypeEnum.PERCENTAGE;
}

export const SaleDetails: React.StatelessComponent = () => {
  const navigate = useNavigator();
  const pushMessage = useNotifier();
  const shop = useShop();

  const handleSaleCreate = (data: SaleCreate) => {
    if (data.saleCreate.errors.length === 0) {
      pushMessage({
        text: i18n.t("Successfully created sale", {
          context: "notification"
        })
      });
      navigate(saleUrl(data.saleCreate.sale.id), true);
    }
  };

  return (
    <TypedSaleCreate onCompleted={handleSaleCreate}>
      {(saleCreate, saleCreateOpts) => {
        const formTransitionState = getMutationState(
          saleCreateOpts.called,
          saleCreateOpts.loading,
          maybe(() => saleCreateOpts.data.saleCreate.errors)
        );

        return (
          <>
            <WindowTitle title={i18n.t("Sales")} />
            <SaleCreatePage
              defaultCurrency={maybe(() => shop.defaultCurrency)}
              disabled={saleCreateOpts.loading}
              errors={maybe(() => saleCreateOpts.data.saleCreate.errors)}
              onBack={() => navigate(saleListUrl())}
              onSubmit={formData =>
                saleCreate({
                  variables: {
                    input: {
                      endDate:
                        formData.endDate === "" ? null : formData.endDate,
                      name: formData.name,
                      startDate:
                        formData.startDate === "" ? null : formData.startDate,
                      type: discountValueTypeEnum(formData.type),
                      value: decimal(formData.value)
                    }
                  }
                })
              }
              saveButtonBarState={formTransitionState}
            />
          </>
        );
      }}
    </TypedSaleCreate>
  );
};
export default SaleDetails;
