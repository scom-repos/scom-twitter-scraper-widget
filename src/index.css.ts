import { Styles } from "@ijstech/components";
const Theme = Styles.Theme.ThemeVars;

export const tweetPreviewStyle = Styles.style({
  padding: '10px',
  alignItems: 'center',
  borderRadius: '10px',
  background: Theme.background.paper,
  gridTemplateColumns: "30px 1fr",
  width: '100%',
  $nest: {
    'i-label': {
      whiteSpace: 'pre-wrap'
    }
  }
})

export const paginationStyle = Styles.style({
  textAlign: 'center'
});

export const textCenterStyle = Styles.style({
  textAlign: 'center'
})