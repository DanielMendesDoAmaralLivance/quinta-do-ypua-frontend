const menuItems = {
  items: [
    {
      id: 'navigation',
      title: 'Navegação',
      type: 'group',
      icon: 'icon-navigation',
      children: [
        {
          id: 'accommodations',
          title: 'Acomodações',
          type: 'item',
          icon: 'feather icon-home',
          url: '/app/accommodations'
        },
        {
          id: 'guests',
          title: 'Hóspedes',
          type: 'item',
          icon: 'feather icon-user',
          url: '/app/guests'
        },
        {
          id: 'reservations',
          title: 'Reservas',
          type: 'item',
          icon: 'feather icon-calendar',
          url: '/app/reservations'
        }
      ]
    }
  ]
};

export default menuItems;
