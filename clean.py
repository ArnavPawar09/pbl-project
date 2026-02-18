"""
Cleaning the dataset
"""

import pandas as pd

df = pd.read_csv("archive\dataset.csv")

"""
print(df.shape)
print(df.columns)
print(df.head())

print(df.info())
print(df.isnull().sum())
"""

# drop duplicate rows
df = df.drop_duplicates()

# replace spaces from column names
df.columns = df.columns.str.strip()
df.columns = df.columns.str.lower()
df.columns = df.columns.str.replace(" ", "_")

df["diseases"] = df["diseases"].str.strip()
df["diseases"] = df["diseases"].str.lower()

# filter out needed values
"""
for disease in sorted(df["diseases"].unique()):
    print(disease)
"""

selected_diseases = ['common cold', 
                     'migraine', 
                     'tension headache', 
                     'flu', 
                     'iron deficiency anemia', 
                     'tonsillitis']

df = df[df["diseases"].isin(selected_diseases)]
print(df["diseases"].value_counts())
df = df.groupby("diseases").head(158)
print(df["diseases"].value_counts())
print(df.isnull().sum().sum())

df.to_csv("cleaned_dataset.csv", index=False)












