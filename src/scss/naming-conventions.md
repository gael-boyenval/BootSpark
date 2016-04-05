## css naming convention

#### We use BEM with this naming convention variant :

```css

.p-blockName._modifierName {}
.p-blockName-elementName._modifierName.is-stateClass {}

```


- ``.[p]`` : prefix. Give you the type of use and where to find the scss file
- ``.p-[blockName]`` : block name and in camelCase
- ``.p-blockName[-]element`` : block name and element are separated by a ``-``.
- ``.p-blockName[._modifierName]`` : modifier names are preceded by ``_`` an underscore. It do not use the naming convention adding the blockName before
- ``is-stateClasse`` : a state classe start with a prefix, this prefix can be `is` or ``has``. ex: ``.is-open`` or ``.has-none``
- state and modifier class take the Root prefix.

#### exemple with SCSS :

```scss
.p-blockName {
    ... // basic styles

    // all modifyers (BEM modifiers / state class / medias-queries )
    // goes right after the first-level declaration

    &._modifierName { // modifier
        ...
    }

    &.is-active { // state class
        ...
    }

    @include screen(small) { // medias-queries
        ...
    }

    &-elementName {
        ... // same structure is applyed to the element

        &._modifierName { // element modifier
            ...
        }

        ._modifierName & {  // bloc level modifier
            ...
        }

        &.is-current { // element level classState
            ...
        }

        .is-active & { // block level classState
            ...
        }

        @include screen(small) {
            ...
        }
    }
}
```

#### in html :

```html
<div class="oo-grid _gutterLarge | o-header _large | m-block _dark">
    <span class="oo-grid-cell _initial | o-header-logo">
        <img src="logo.svg" alt="">
    </span>
</div>
```

- the selectors are ordered by level, the highters first
- the groups are separated by |
- the block and element level selectors are folowed by there modifiers
