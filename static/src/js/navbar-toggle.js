document.addEventListener('DOMContentLoaded', function () {
  const toggleButton = document.querySelector(
    '[data-collapse-toggle="navbar-default"]'
  );
  const navbarMenu = document.getElementById('navbar-default');

  if (toggleButton && navbarMenu) {
    toggleButton.addEventListener('click', function () {
      navbarMenu.classList.toggle('hidden');

      const isExpanded = navbarMenu.classList.contains('hidden') === false;
      toggleButton.setAttribute('aria-expanded', isExpanded);
    });
  }
});
