# Blending demo

Blending products (bulk materials or oils) is a typically encountered procedure in industry.

The goal is to maximize profitability while fulfilling the required customer / technical marketing specifications.

A typical scenario might be to have multiple grades of material and multiple customer orders for different grades. The goal is to use as least as possible of a "premium" grade in the mix for a customer that does not willing to pay for this extra quality.

These grades can be defined across multiple assays. For example, in a coal industry it might be the `ash` left after burning the coal in certain conditions, or `moisture`. With this multiplicity the problem becomes more complex, since now we need to "nail" the order among multiple specs while reducing costs by using the least "precious" materials.

## Data generator
You can generate an input excel data which contains orders and product information. This is meant to be a substitute for actual data for demo and dev purposes. To use it, go do `data_mock` directory and run 
```
$ python ./generator.py
```