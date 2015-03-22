function toggleCollapsed(el) {
    var $this = $(el);
    var show = $this.attr("aria-expanded");
    $this.text(show === "true" ? "Show python code:" : "Hide python code:");
}