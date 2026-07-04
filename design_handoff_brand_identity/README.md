# Handoff : Identité visuelle — Pottery by Séverine

## Overview
Système d'identité pour un atelier de céramique / poterie artisanale (« Pottery by Séverine »).
Le logo est une modernisation d'un logo original au trait : un vase rond bulbeux surmonté d'une
petite tige botanique, entouré du texte « POTTERY BY / SÉVERINE » disposé en cercle.
La direction est chaleureuse et terreuse (terracotta, ocre, argile) pour évoquer l'argile et le grès.

Usage prévu : **site web**, **Instagram**, et plus tard un **tampon en argile** (version au trait).

## About the Design Files
Les fichiers de ce dossier sont des **références de design en HTML/SVG** — des maquettes montrant
l'apparence et le système de marque, pas du code de production à copier tel quel.
Le travail consiste à **recréer ces designs dans l'environnement cible** (React, Vue, Astro, HTML
statique…) selon ses conventions. Si aucun projet n'existe encore, choisir le framework le plus
adapté (un site vitrine de céramiste s'accommode très bien d'Astro / Next statique).

Les **SVG dans `assets/`** sont, eux, **directement utilisables** en production.

## Fidelity
**High-fidelity (hifi).** Couleurs, typographie et géométrie sont finales. Les tracés SVG fournis
sont les tracés définitifs du logo.

## Fichiers fournis
- `Pottery-by-Severine-Identite.dc.html` — la planche complète (logo + déclinaisons + palette + applications). *Fichier de référence visuelle ; c'est un « Design Component » et il nécessite son runtime pour s'ouvrir tel quel — sert de maquette, pas d'asset.*
- `assets/logo-badge.svg` — logo principal circulaire (200×200), **asset utilisable**.
- `assets/logo-icon.svg` — marque seule vase + tige (100×100), pour favicon / avatar, **asset utilisable**.
- `assets/logo-stamp.svg` — version au trait monochrome pour le tampon, **asset utilisable**.

> Note sur les SVG : le texte circulaire utilise la police **Jost**. Pour un rendu identique, charger
> Jost sur la page, **ou** vectoriser le texte (convertir en tracés) dans un éditeur pour figer la forme.

---

## La marque (géométrie SVG)
Tous les tracés sont définis dans un `viewBox="0 0 100 100"`.

**Vase (silhouette pleine)**
```
M43,42 C43,52 27,59 27,74 C27,89 37,96 50,96 C63,96 73,89 73,74 C73,59 57,52 57,42 Z
```

**Tige botanique (4 tracés pleins : tige + feuille gauche + feuille droite + bourgeon)**
```
M49,42 C49,34 49,25 50.6,17 L53.4,17 C51.8,25 51,34 51,42 Z        (tige)
M49.5,34 C43,33 39.5,25.5 44,22 C48.5,25 51,29 49.5,34 Z            (feuille gauche)
M51.5,25 C58,24.5 61.5,17.5 57,14.5 C52.5,17.5 50,22 51.5,25 Z      (feuille droite)
M52.5,16.5 C48.5,12.5 49,5 53,3.5 C57,5 57.5,12.5 52.5,16.5 Z        (bourgeon)
```

**Version au trait (tampon)** : même tracé de vase mais `fill="none" stroke` (épaisseur 2.6,
`stroke-linejoin:round`), plus la ligne d'ouverture du col `M43,42 L57,42`. La tige reste pleine.

**Texte circulaire** — deux arcs (rayon ≈ 66 / 64, centre 100,100) :
```
arc haut : M34,100 A66,66 0 0 1 166,100   → « POTTERY BY »
arc bas  : M36,100 A64,64 0 0 0 164,100   → « SÉVERINE »
```
`font-size` 15.5, `letter-spacing` 5.5, `text-anchor:middle`, `startOffset:50%`.
Deux points d'accent (r 2.4, terracotta) à 3 h et 9 h : `cx 29 / 171, cy 100`.

---

## Déclinaisons
1. **Logo principal** — positif (marque sur crème) et négatif (sur argile #5A4331, vase en ocre).
2. **Horizontal** — marque à gauche, « Séverine » (Cormorant) + « POTTERY · CÉRAMIQUE » à droite, séparés par un filet vertical.
3. **Icône seule** — vase + tige, sur fond terracotta (vase crème) ou crème (vase terracotta).
4. **Monogramme** — « S » Cormorant dans un cercle fin ocre, mot « POTTERY » en bas.
5. **Tampon** — `logo-stamp.svg`, un seul contour, monochrome argile.

## Applications montrées
- Carte de visite (fond terracotta, texte crème, marque en filigrane).
- Photo de profil Instagram (avatar rond, bordure ocre) + entête de profil.
- Étiquettes produit (crème et ocre) avec œillet.

---

## Design Tokens

### Couleurs
- Terracotta (accent principal) : `#B65C39`
- Terracotta clair : `#CE8A5F`
- Ocre : `#C89A46`
- Argile (texte / foncé) : `#5A4331`
- Argile clair (texte secondaire) : `#7A6250`
- Sable : `#E4D2B8`
- Crème (fond page) : `#F1E5D3`
- Papier (fond cartes) : `#FBF5EB`
- Filets / bordures : `#D6C2A4`

### Typographie
- **Cormorant Garamond** (serif) — titres, nom « Séverine ». Poids 400–600. Google Fonts.
- **Jost** (sans-serif géométrique) — texte circulaire, libellés, texte courant. Poids 300–500.
  Toujours en **capitales espacées** pour les libellés (`letter-spacing` 0.28–0.42em).

### Rayons / ombres
- Cartes : `border-radius: 14px`.
- Étiquettes / carte de visite : `10px` (carte), `8px` (étiquettes).
- Ombre carte de visite : `0 16px 30px rgba(90,67,49,0.28)`.

## Assets
- Logos SVG : fournis dans `assets/` (créés à la main pour ce projet, libres d'usage pour la marque).
- Le logo original importé par la cliente n'est pas nécessaire — ces SVG le remplacent.

## Notes
- Prévoir un favicon à partir de `logo-icon.svg` (lisible dès 16 px grâce à la silhouette pleine).
- Pour le tampon physique : partir de `logo-stamp.svg`, vectoriser le texte, exporter en vecteur (PDF/SVG) pour le graveur.
