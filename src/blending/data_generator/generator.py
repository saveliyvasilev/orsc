import numpy as np
import pandas as pd
import matplotlib.pyplot as plt


def _normal_distribution(mu, sigma, n) -> np.ndarray:
    return sigma * np.random.randn(n) + mu


light_crude_oil = {
    "API_gravity": {
        "mu": 39.55,
        "sigma": 1.19,
    },
    "sulphur": {
        "mu": 0.13,
        "sigma": 0.023,
    },
}

heavy_crude_oil = {
    "API_gravity": {
        "mu": 26.22,
        "sigma": 3.52,
    },
    "sulphur": {
        "mu": 0.2,
        "sigma": 0.04,
    },
}


def _generate_specific_crude_table(
    assay_statistics, n_samples, reserve_mean, reserve_sigma
) -> pd.DataFrame:
    API_gravity = _normal_distribution(
        assay_statistics["API_gravity"]["mu"],
        assay_statistics["API_gravity"]["sigma"],
        n_samples,
    )
    sulphur = _normal_distribution(
        assay_statistics["sulphur"]["mu"],
        assay_statistics["sulphur"]["sigma"],
        n_samples,
    )
    reserves = np.abs(_normal_distribution(reserve_mean, reserve_sigma, n_samples))
    return pd.DataFrame(
        {"API_gravity": API_gravity, "sulphur": sulphur, "reserves": reserves}
    )


def generate_product_table() -> pd.DataFrame:
    nheavy = 15
    nlight = 5
    df_heavy = _generate_specific_crude_table(heavy_crude_oil, nheavy, 150, 60)
    df_light = _generate_specific_crude_table(light_crude_oil, nlight, 50, 25)
    df = pd.concat([df_heavy, df_light])
    df["product_id"] = np.arange(1, 1 + nheavy + nlight)
    return df


def _generate_specific_orders(
    assay_statistics, n_samples, order_amount_mean, order_amount_sigma
) -> pd.DataFrame:
    API_gravity_lb = _normal_distribution(
        assay_statistics["API_gravity"]["mu"] * 0.95,
        assay_statistics["API_gravity"]["sigma"],
        n_samples,
    )
    API_gravity_lb_to_ub_increase = np.abs(
        _normal_distribution(
            assay_statistics["API_gravity"]["sigma"],
            assay_statistics["API_gravity"]["sigma"],
            n_samples,
        )
    )
    API_gravity_ub = API_gravity_lb + API_gravity_lb_to_ub_increase
    API_gravity_hard_lb = API_gravity_lb * 0.9
    API_gravity_hard_ub = API_gravity_ub * 1.1

    sulphur_lb = _normal_distribution(
        assay_statistics["sulphur"]["mu"] * 0.95,
        assay_statistics["sulphur"]["sigma"],
        n_samples,
    )
    sulphur_lb_to_ub_increase = np.abs(
        _normal_distribution(
            assay_statistics["sulphur"]["sigma"],
            assay_statistics["sulphur"]["sigma"],
            n_samples,
        )
    )
    sulphur_ub = sulphur_lb + sulphur_lb_to_ub_increase
    sulphur_hard_lb = sulphur_lb * 0.9
    sulphur_hard_ub = sulphur_ub * 1.1

    amount = _normal_distribution(order_amount_mean, order_amount_sigma, n_samples)
    return pd.DataFrame(
        {
            "API_gravity_hard_lb": API_gravity_hard_lb,
            "API_gravity_soft_lb": API_gravity_lb,
            "API_gravity_soft_ub": API_gravity_ub,
            "API_gravity_hard_ub": API_gravity_hard_ub,
            "sulphur_hard_lb": sulphur_hard_lb,
            "sulphur_soft_lb": sulphur_lb,
            "sulphur_soft_ub": sulphur_ub,
            "sulphur_hard_ub": sulphur_hard_ub,
            "amount": amount,
        }
    )


def generate_orders_table() -> pd.DataFrame:
    # An order has an amount of product and bounds for the assays
    n_dem = 10
    n_non_dem = 35
    df_demanding = _generate_specific_orders(light_crude_oil, n_dem, 55, 15)
    df_non_demanding = _generate_specific_orders(heavy_crude_oil, n_non_dem, 50, 15)

    df = pd.concat([df_demanding, df_non_demanding])
    df["order_id"] = np.arange(1, 1 + n_dem + n_non_dem)
    return df


if __name__ == "__main__":
    df_products = generate_product_table()
    df_orders = generate_orders_table()
    with pd.ExcelWriter("./input_data.xlsx") as writer:
        df_products.to_excel(writer, sheet_name="products", index=False)
        df_orders.to_excel(writer, sheet_name="orders", index=False)
