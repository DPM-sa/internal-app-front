import React from 'react';
import clsx from 'clsx';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import PeopleIcon from '@material-ui/icons/People';
import DnsRoundedIcon from '@material-ui/icons/DnsRounded';
import PermMediaOutlinedIcon from '@material-ui/icons/PhotoSizeSelectActual';
import PublicIcon from '@material-ui/icons/Public';
import SettingsEthernetIcon from '@material-ui/icons/SettingsEthernet';

const children = [
  { id: 'Posteos', icon: <PeopleIcon />, active: true },
  { id: 'Directorio', icon: <DnsRoundedIcon /> },
  { id: 'Biblioteca', icon: <PermMediaOutlinedIcon /> },
  { id: 'Buzon', icon: <PublicIcon /> },
  { id: 'Slider', icon: <SettingsEthernetIcon /> }
]

const styles = (theme) => ({
  categoryHeader: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  categoryHeaderPrimary: {
    color: theme.palette.common.white,
  },
  item: {
    paddingTop: 1,
    paddingBottom: 1,
    color: 'rgba(255, 255, 255, 0.7)',
    '&:hover,&:focus': {
      backgroundColor: 'rgba(255, 255, 255, 0.08)',
    },
  },
  itemCategory: {
    backgroundColor: '#232f3e',
    boxShadow: '0 -1px 0 #404854 inset',
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  firebase: {
    fontSize: 24,
    color: theme.palette.common.white,
  },
  itemActiveItem: {
    color: '#4fc3f7',
  },
  itemPrimary: {
    fontSize: 'inherit',
  },
  itemIcon: {
    minWidth: 'auto',
    marginRight: theme.spacing(2),
  },
  divider: {
    marginTop: theme.spacing(2),
  },
});

function Navigator(props) {
  const { classes, ...other } = props;

  const handleClick = (id, e) => {
    children.filter(item => {
      if (item.id === id) {
        item.active = true
        e.target.classList.add(classes.itemActiveItem)
        console.log("item:", item)
        console.log("e:", e.target)
      } else {
        item.active = false
        e.target.classList.remove(classes.itemActiveItem)
      }
    })
  }

  return (
    <Drawer variant="permanent" {...other}>
      <List disablePadding>
        <ListItem className={clsx(classes.firebase, classes.item, classes.itemCategory)}>
          Admin Comunicacion Interna
        </ListItem>
        {children.map(({ id, icon, active }) => (
          <ListItem
            key={id}
            button
            className={clsx(classes.item, active && classes.itemActiveItem)}
            onClick={(e) => handleClick(id, e)}
          >
            <ListItemIcon className={classes.itemIcon}>{icon}</ListItemIcon>
            <ListItemText
              classes={{
                primary: classes.itemPrimary,
              }}
            >
              {id}
            </ListItemText>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}

export default withStyles(styles)(Navigator);