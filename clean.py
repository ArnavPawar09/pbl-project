"""
Cleaning the dataset - Expanded for more common diseases
"""

import pandas as pd

df = pd.read_csv("archive/dataset.csv")

# drop duplicate rows
df = df.drop_duplicates()

# replace spaces from column names
df.columns = df.columns.str.strip()
df.columns = df.columns.str.lower()
df.columns = df.columns.str.replace(" ", "_")

df["diseases"] = df["diseases"].str.strip()
df["diseases"] = df["diseases"].str.lower()

# --- Expanded list of common diseases following the project's theme ---
# Theme: Everyday ailments a person might visit a general physician for.
# Categories: Respiratory, Pain/Headache, Infection, Deficiency, Digestive, Allergic
selected_diseases = [
    # Original diseases
    'common cold',
    'migraine',
    'tension headache',
    'flu',
    'iron deficiency anemia',
    'tonsillitis',
    # Respiratory
    'bronchitis',
    'pneumonia',
    'laryngitis',
    'sinusitis',
    # Infectious
    'strep throat',
    'urinary tract infection',
    'ear infection (otitis media)',
    'viral pharyngitis',
    # Digestive
    'gastroenteritis',
    'indigestion',
    'gastritis',
    # Allergic / Skin
    'seasonal allergies (hay fever)',
    'allergic contact dermatitis',
    # Deficiency / Systemic
    'vitamin b12 deficiency',
    'vitamin d deficiency',
    'hypothyroidism',
    # Pain
    'sciatica',
]

# Some diseases have slightly different names in the dataset.
# Let's also try matching with common alternates.
alternate_names = {
    'ear infection (otitis media)': 'otitis media',
    'viral pharyngitis': 'pharyngitis',
    'gastroenteritis': 'infectious gastroenteritis',
    'gastritis': 'acute gastritis',
    'sinusitis': 'chronic sinusitis',
}

# Build the final set of disease names to look for
all_target_names = set(selected_diseases)
all_target_names.update(alternate_names.values())

# Filter
df_filtered = df[df["diseases"].isin(all_target_names)]

# Rename alternates back to canonical names for consistency
reverse_map = {v: k for k, v in alternate_names.items()}
df_filtered = df_filtered.copy()
df_filtered["diseases"] = df_filtered["diseases"].replace(reverse_map)

print("--- Disease counts BEFORE balancing ---")
print(df_filtered["diseases"].value_counts())
print(f"\nTotal rows: {len(df_filtered)}")

# Balance: cap each disease at a max number of samples
max_samples_per_disease = 300
df_balanced = df_filtered.groupby("diseases").head(max_samples_per_disease)

print("\n--- Disease counts AFTER balancing ---")
print(df_balanced["diseases"].value_counts())

# Remove diseases with too few samples for reliable stratified splitting
min_samples = 20
disease_counts = df_balanced["diseases"].value_counts()
valid_diseases = disease_counts[disease_counts >= min_samples].index
df_balanced = df_balanced[df_balanced["diseases"].isin(valid_diseases)]

print(f"\n--- After removing diseases with < {min_samples} samples ---")
print(df_balanced["diseases"].value_counts())
print(f"\nTotal rows: {len(df_balanced)}")
print(f"Null values: {df_balanced.isnull().sum().sum()}")

# Drop columns that are ALL zeros (unused symptoms for this subset)
symptom_cols = [c for c in df_balanced.columns if c != 'diseases']
non_zero_cols = [c for c in symptom_cols if df_balanced[c].sum() > 0]
df_balanced = df_balanced[['diseases'] + non_zero_cols]

print(f"\nFinal feature count: {len(non_zero_cols)} symptoms")
print(f"Final disease count: {df_balanced['diseases'].nunique()} diseases")

df_balanced.to_csv("cleaned_dataset.csv", index=False)
print("\nSaved to cleaned_dataset.csv")
