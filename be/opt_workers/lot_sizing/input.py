from .types import Sets, Coefficients
from typing import Dict, List, Set, Tuple

# Hint: before digging a rabbit hole here, consider converting
# these creational functions into factories, since this might
# be handy for a smooth transition from excel-based inputs to
# something more database-like (and there most likely the
# preprocessing and data input format might differ)
# I've seen this be super helpful when one stream was
# dedicated to analyse scenarios, while another to integrate with
# live systems -- being able to plug-in factories and run both
# setups was a blessing.


def build_sets() -> Sets:
    return Sets(locations={"LocationA", "LocationB"}, time_buckets=list(range(20)))


def demand(sets: Sets) -> Dict[Tuple[str, int], float]:
    out = dict()
    for location in sets.locations:
        for time in sets.time_buckets:
            out[location, time] = (1 + time) * 100
    return out


def stock_capacity(sets: Sets) -> Dict[str, float]:
    out = dict()
    for location in sets.locations:
        out[location] = 150
    return out


def production_cost(sets: Sets) -> Dict[Tuple[str, int], float]:
    out = dict()
    for location in sets.locations:
        for time in sets.time_buckets:
            out[location, time] = 5 * (40 - time)
    return out


def initial_stock(sets: Sets) -> Dict[str, float]:
    out = dict()
    for location in sets.locations:
        out[location] = 0
    return out


def stock_cost(sets: Sets) -> Dict[str, float]:
    return {l: 10 for l in sets.locations}


def build_coefficients(sets: Sets) -> Coefficients:
    return Coefficients(
        production_cost=production_cost(sets=sets),
        demand=demand(sets=sets),
        stock_capacity=stock_capacity(sets=sets),
        initial_stock=initial_stock(sets=sets),
        stock_cost=stock_cost(sets=sets),
    )
