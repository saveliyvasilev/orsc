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
    "sulfur": {
        "mu": 0.13,
        "sigma": 0.023,
    },
}

heavy_crude_oil = {
    "API_gravity": {
        "mu": 26.22,
        "sigma": 3.52,
    },
    "sulfur": {
        "mu": 0.2,
        "sigma": 0.04,
    },
}


def _generate_specific_crude_table(
    assay_statistics, n_samples, reserve_mean, reserve_sigma, cost=50.0
) -> pd.DataFrame:
    API_gravity = _normal_distribution(
        assay_statistics["API_gravity"]["mu"],
        assay_statistics["API_gravity"]["sigma"],
        n_samples,
    )
    sulfur = _normal_distribution(
        assay_statistics["sulfur"]["mu"],
        assay_statistics["sulfur"]["sigma"],
        n_samples,
    )
    reserves = np.abs(_normal_distribution(reserve_mean, reserve_sigma, n_samples))
    costs = np.ones(n_samples) * cost
    return pd.DataFrame(
        {
            "API_gravity": API_gravity,
            "sulfur": sulfur,
            "reserves": reserves,
            "cost": costs,
        }
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

    sulfur_lb = _normal_distribution(
        assay_statistics["sulfur"]["mu"] * 0.95,
        assay_statistics["sulfur"]["sigma"],
        n_samples,
    )
    sulfur_lb_to_ub_increase = np.abs(
        _normal_distribution(
            assay_statistics["sulfur"]["sigma"],
            assay_statistics["sulfur"]["sigma"],
            n_samples,
        )
    )
    sulfur_ub = sulfur_lb + sulfur_lb_to_ub_increase
    sulfur_hard_lb = sulfur_lb * 0.9
    sulfur_hard_ub = sulfur_ub * 1.1

    amount = _normal_distribution(order_amount_mean, order_amount_sigma, n_samples)
    return pd.DataFrame(
        {
            "API_gravity_hard_lb": API_gravity_hard_lb,
            "API_gravity_soft_lb": API_gravity_lb,
            "API_gravity_soft_ub": API_gravity_ub,
            "API_gravity_hard_ub": API_gravity_hard_ub,
            "sulfur_hard_lb": sulfur_hard_lb,
            "sulfur_soft_lb": sulfur_lb,
            "sulfur_soft_ub": sulfur_ub,
            "sulfur_hard_ub": sulfur_hard_ub,
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
    df["order_id"] = "Order " + np.arange(1, 1 + n_dem + n_non_dem)
    return df


if __name__ == "__main__":
    df_products = generate_product_table()
    df_orders = generate_orders_table()
    with pd.ExcelWriter("./input_data.xlsx") as writer:
        df_products.to_excel(writer, sheet_name="products", index=False)
        df_orders.to_excel(writer, sheet_name="orders", index=False)
