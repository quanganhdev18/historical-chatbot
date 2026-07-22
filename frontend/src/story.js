export const STORY_BATRIEU = {
  // HỒI 1: LỜI THỀ TRÊN NÚI NƯA
  start: {
    chapter: "HỒI 1: LỜI THỀ TRÊN NÚI NƯA",
    speaker: "Dòng Lịch Sử",
    avatar: "📜",
    emotion: "solemn",
    sfx: "wind",
    text: "Năm 248 Dương Lịch. Sương đêm phủ kín ngàn Nưa lạnh buốt. Tại sảnh đường, những tiếng tranh cãi gay gắt vang lên. Triệu Thị Trinh năm nay 23 tuổi, thân hình cao lớn, võ nghệ siêu quần, đang bị các trưởng lão trong họ ép phải lấy chồng thay vì tụ tập dân đinh luyện võ. Bạn - một phó tướng kiêm quân sư thân tín - đang đứng ngoài cửa nghe lén.",
    choices: [
      { label: "⚔️ Bức xúc đẩy cửa bước vào bênh vực Bà Triệu", nextId: "act1_support" },
      { label: "📜 Khẽ gõ cửa, bước vào khuyên can nhẹ nhàng để giữ hòa khí", nextId: "act1_advise" }
    ]
  },
  act1_support: {
    chapter: "HỒI 1: LỜI THỀ TRÊN NÚI NƯA",
    speaker: "Trưởng Lão Triệu Gia",
    avatar: "👴",
    emotion: "angry",
    sfx: "slam",
    text: "(Đập bàn giận dữ) Kẻ bề dưới câm miệng! Phận nữ nhi nương nhờ cửa họ, đến tuổi cập kê không gả chồng sinh con, lại ngày ngày vác gươm múa giáo xúi giục phản loạn. Mày định kéo cả họ Triệu này tru di cửu tộc hay sao?",
    choices: [
      { label: "💥 Tranh cãi lại: 'Nước mất nhà tan, sao cam chịu làm nô lệ!'", nextId: "act1_batrieu_oath" },
      { label: "🛡️ Lùi lại một bước, quay sang chờ xem Bà Triệu phản ứng", nextId: "act1_batrieu_oath" }
    ]
  },
  act1_advise: {
    chapter: "HỒI 1: LỜI THỀ TRÊN NÚI NƯA",
    speaker: "Trưởng Lão Triệu Gia",
    avatar: "👴",
    emotion: "neutral",
    sfx: "wind",
    text: "(Vuốt râu) Phó tướng nói phải. Thị Trinh, con nên biết nhẫn nhịn. Sức đàn bà con gái sao chống lại được quan binh Đông Ngô? Chi bằng ta gả con cho tên quan thú họ Tôn, vừa êm chuyện lại có chỗ dựa quyền thế.",
    choices: [
      { label: "🤝 Gật gù hùa theo trưởng lão để xoa dịu tình hình", nextId: "act1_batrieu_oath" },
      { label: "⚡ Liếc nhìn sắc mặt Bà Triệu đang lập tức biến đổi...", nextId: "act1_batrieu_oath" }
    ]
  },
  act1_batrieu_oath: {
    chapter: "HỒI 1: LỜI THỀ TRÊN NÚI NƯA",
    speaker: "Bà Triệu",
    avatar: "👸",
    emotion: "heroic",
    sfx: "sword",
    text: "(Rút phăng thanh gươm chém đứt góc bàn, ánh mắt rực lửa) Các người nghe cho rõ đây! Tôi muốn cưỡi cơn gió mạnh, đạp luồng sóng dữ, chém cá kình ở biển Đông, đánh đuổi quân Ngô, giành lại giang sơn, cởi ách nô lệ, chứ không chịu khom lưng làm tì thiếp cho người!",
    choices: [
      { label: "🚩 Quỳ xuống thề nguyện: 'Xin nguyện theo chủ tướng đến cùng!'", nextId: "act2_start" },
      { label: "⚔️ Nhiệt huyết sôi trào: 'Tôi sẽ làm tiên phong phá giặc!'", nextId: "act2_start" }
    ]
  },

  // HỒI 2: THUẦN PHỤC VOI TRẮNG
  act2_start: {
    chapter: "HỒI 2: THUẦN PHỤC VOI TRẮNG",
    speaker: "Dòng Lịch Sử",
    avatar: "📜",
    emotion: "solemn",
    sfx: "horn",
    text: "Sau lời thề vang dội ấy, Bà Triệu dựng cờ khởi nghĩa. Thanh thế ngày một lớn. Bấy giờ ở vùng núi Quan Yên xuất hiện một con voi trắng vô cùng hung tợn, thường xuyên phá hoại mùa màng. Bà Triệu quyết tâm thu phục voi trắng làm thú cưỡi ra trận. Cả đoàn vây ráp voi trắng bên vách đá.",
    choices: [
      { label: "🏹 [Chiến Thuật] Khuyên dùng giáo mác và tên độc để đánh khuất phục voi", nextId: "act2_force" },
      { label: "🍌 [Chiến Thuật] Khuyên đào hố bẫy, sau đó dụ voi bằng mía và chuối", nextId: "act2_tame" }
    ]
  },
  act2_force: {
    chapter: "HỒI 2: THUẦN PHỤC VOI TRẮNG",
    speaker: "Bà Triệu",
    avatar: "👸",
    emotion: "angry",
    sfx: "battle",
    text: "Thú dữ phải trị bằng đao kiếm! Phó tướng, hạ lệnh bắn tên xước da nó, buộc nó lùi vào vách đá cạn kiệt thể lực cho Ta!",
    choices: [
      { label: "💥 Tiến hành tấn công voi trắng không thương tiếc", nextId: "act2_force_result" },
      { label: "🏹 Bắn cảnh cáo để đe doạ thay vì lấy mạng", nextId: "act2_force_result" }
    ]
  },
  act2_force_result: {
    chapter: "HỒI 2: THUẦN PHỤC VOI TRẮNG",
    speaker: "Dòng Lịch Sử",
    avatar: "📜",
    emotion: "solemn",
    sfx: "thunder",
    text: "Con voi trắng điên cuồng chống trả, giẫm chết hàng chục nghĩa quân. Cuối cùng, vì kiệt sức và mất máu, nó gục xuống và chịu khuất phục. Bà Triệu có được voi thần nhưng lòng quân ít nhiều hoang mang vì sự tàn nhẫn và tổn thất quá lớn.",
    choices: [
      { label: "📣 Trấn an quân lính: 'Sự hi sinh là cần thiết cho đại sự'", nextId: "act3_start_ruthless" },
      { label: "🛡️ Chấp nhận tổn thất để đạt mục đích lớn hơn", nextId: "act3_start_ruthless" }
    ]
  },
  act2_tame: {
    chapter: "HỒI 2: THUẦN PHỤC VOI TRẮNG",
    speaker: "Bà Triệu",
    avatar: "👸",
    emotion: "heroic",
    sfx: "wind",
    text: "Con voi này có linh tính, đánh nó bằng vũ lực chỉ thu được cái xác không hồn. Ta sẽ nghe ngươi. Giăng bẫy nhưng tuyệt đối không làm nó xước một giọt máu. Ta sẽ tự mình xuống hầm dụ nó.",
    choices: [
      { label: "🍌 Chuẩn bị hoa quả và thức ăn thả xuống hầm", nextId: "act2_tame_result" },
      { label: "🤝 Trực tiếp hỗ trợ Bà Triệu vỗ về voi trắng", nextId: "act2_tame_result" }
    ]
  },
  act2_tame_result: {
    chapter: "HỒI 2: THUẦN PHỤC VOI TRẮNG",
    speaker: "Dòng Lịch Sử",
    avatar: "📜",
    emotion: "victorious",
    sfx: "horn",
    text: "Dưới hầm bẫy, Bà Triệu kiên nhẫn nhiều ngày ròng rã trò chuyện, vuốt ve và cho voi ăn. Cảm mến sự chân thành và oai phong của Nữ tướng, voi trắng ngoan ngoãn cúi đầu cho Bà cưỡi. Tiếng tăm Bà Triệu như một nữ thần vang dội khắp Giao Châu.",
    choices: [
      { label: "🔥 Sĩ khí quân đội dâng cao vút đến tận mây xanh", nextId: "act3_start_compassion" },
      { label: "🚩 Tự hào đứng chung hàng ngũ dưới bóng voi thần", nextId: "act3_start_compassion" }
    ]
  },

  // HỒI 3: KẺ PHẢN BỘI VÀ ÁP LỰC CHỈ HUY
  act3_start_ruthless: {
    chapter: "HỒI 3: KẺ PHẢN BỘI VÀ ÁP LỰC CHỈ HUY",
    speaker: "Dòng Lịch Sử",
    avatar: "📜",
    emotion: "solemn",
    sfx: "thunder",
    text: "Năm 248. Thứ sử Giao Châu là Lục Dận đem 8.000 quân tinh nhuệ sang đàn áp. Trong lúc dầu sôi lửa bỏng, một toán lính bị phát hiện lén mang mật thư dâng nộp phòng tuyến cho Lục Dận.",
    choices: [
      { label: "⛓️ Lập tức trói chặt chúng giải lên trướng", nextId: "act3_traitor_ruthless" },
      { label: "📜 Khám xét thu giữ toàn bộ mật thư làm bằng chứng", nextId: "act3_traitor_ruthless" }
    ]
  },
  act3_traitor_ruthless: {
    chapter: "HỒI 3: KẺ PHẢN BỘI VÀ ÁP LỰC CHỈ HUY",
    speaker: "Bà Triệu",
    avatar: "👸",
    emotion: "angry",
    sfx: "sword",
    text: "(Nhìn xuống những kẻ phản bội đang run rẩy) Bọn cặn bã! Ta đã ban cho các ngươi cơ hội thoát kiếp nô lệ, vậy mà các ngươi lại cắn ngược lại ta. Phó tướng, hãy lôi bọn chúng ra pháp trường chém đầu bêu cọc, tru di cửu tộc cho Ta!",
    choices: [
      { label: "⚔️ Vâng lệnh! Xử quyết không tha để lập uy!", nextId: "act4_start_dark" },
      { label: "🕊️ Chỉ chém kẻ cầm đầu, tha cho gia đình chúng để lấy lòng nhân tâm", nextId: "act4_start_normal" }
    ]
  },
  act3_start_compassion: {
    chapter: "HỒI 3: KẺ PHẢN BỘI VÀ ÁP LỰC CHỈ HUY",
    speaker: "Dòng Lịch Sử",
    avatar: "📜",
    emotion: "heroic",
    sfx: "drum",
    text: "Nhờ uy danh voi thần, quân khởi nghĩa chiến đấu vô cùng anh dũng cản bước Lục Dận. Tuy nhiên, nội bộ binh lính bắt đầu lung lay do Lục Dận tung tin đồn và mua chuộc. Đội canh gác vừa bắt được một lính tráng định đào ngũ trong đêm.",
    choices: [
      { label: "🗡️ Rút gươm áp giải hắn lên gặp Nữ tướng", nextId: "act3_traitor_compassion" },
      { label: "🗣️ Khuyên hắn nên thành thật khai báo để được khoan hồng", nextId: "act3_traitor_compassion" }
    ]
  },
  act3_traitor_compassion: {
    chapter: "HỒI 3: KẺ PHẢN BỘI VÀ ÁP LỰC CHỈ HUY",
    speaker: "Lính Đào Ngũ",
    avatar: "🪖",
    emotion: "fearful",
    sfx: "wind",
    text: "(Dập đầu khóc lóc) Xin Nữ tướng tha mạng! Ở nhà con còn mẹ già mù lòa không ai chăm sóc. Con không muốn phản quốc, con chỉ quá sợ chết... Con không muốn đánh nữa!",
    choices: [
      { label: "⚔️ Quân pháp bất vị thân! Xin Bà cho chém đầu lập uy!", nextId: "act4_start_normal" },
      { label: "🕊️ Lấy đức phục nhân. Xin Bà đánh 50 roi răn đe rồi cho hắn về quê.", nextId: "act4_start_true" }
    ]
  },

  // HỒI 4: HUYẾT CHIẾN BỒ ĐIỀN
  act4_start_dark: {
    chapter: "HỒI 4: HUYẾT CHIẾN BỒ ĐIỀN",
    speaker: "Dòng Lịch Sử",
    avatar: "📜",
    emotion: "angry",
    sfx: "battle",
    text: "Trận Bồ Điền nổ ra ác liệt. Đội quân của Bà Triệu chiến đấu với sự điên cuồng và khát máu. Bọn tay chân của Lục Dận bị nghiền nát dưới chân voi. Tuy nhiên, Lục Dận vô cùng nham hiểm, hắn lùa hàng ngàn bá tánh tay không tấc sắt đi đầu làm bia đỡ đạn.",
    choices: [
      { label: "⚔️ Nín thở chờ lệnh chủ tướng", nextId: "act4_dark_decision" },
      { label: "💔 Nhìn hàng ngàn bá tánh mà lòng dạ đau xót", nextId: "act4_dark_decision" }
    ]
  },
  act4_dark_decision: {
    chapter: "HỒI 4: HUYẾT CHIẾN BỒ ĐIỀN",
    speaker: "Bà Triệu",
    avatar: "👸",
    emotion: "angry",
    sfx: "fire",
    text: "(Cười lạnh lẽo) Lục Dận, ngươi tưởng giấu trong dân là Ta không dám động thủ? Bất kì kẻ nào đứng trên chiến trường đều là kẻ thù! Phó tướng, truyền lệnh dùng hỏa tiễn! Bắn chết tất cả những kẻ cản đường!",
    choices: [
      { label: "🏹 Phóng tiễn! Không từ thủ đoạn để giành độc lập!", nextId: "ending_dark" },
      { label: "🛑 Ngăn cản Bà Triệu làm việc ác, thà chết không hại dân!", nextId: "ending_bad" }
    ]
  },
  act4_start_normal: {
    chapter: "HỒI 4: HUYẾT CHIẾN BỒ ĐIỀN",
    speaker: "Dòng Lịch Sử",
    avatar: "📜",
    emotion: "solemn",
    sfx: "thunder",
    text: "Sự phân vân giữa kỉ luật và nhân nhượng khiến nhuệ khí nghĩa quân không thực sự kiên định. Tại trận Bồ Điền, 8.000 quân Ngô bất ngờ đột kích trong đêm, phá vỡ tuyến phòng thủ.",
    choices: [
      { label: "📯 Thổi tù và báo động toàn quân", nextId: "act4_normal_decision" },
      { label: "🛡️ Mặc giáp xông thẳng ra tiền tuyến đỡ đòn", nextId: "act4_normal_decision" }
    ]
  },
  act4_normal_decision: {
    chapter: "HỒI 4: HUYẾT CHIẾN BỒ ĐIỀN",
    speaker: "Bà Triệu",
    avatar: "👸",
    emotion: "solemn",
    sfx: "wind",
    text: "Phó tướng! Bốn phía đều là giặc Ngô, chúng ta đã bị bao vây. Giờ không phải lúc manh động, ta còn quân đội, còn hi vọng.",
    choices: [
      { label: "🌲 Mở đường máu rút lui về rừng sâu bảo toàn lực lượng", nextId: "ending_normal" },
      { label: "🏳️ Đầu hàng quân Ngô để giữ lại mạng sống cho binh lính", nextId: "ending_bad" }
    ]
  },
  act4_start_true: {
    chapter: "HỒI 4: HUYẾT CHIẾN BỒ ĐIỀN",
    speaker: "Dòng Lịch Sử",
    avatar: "📜",
    emotion: "heroic",
    sfx: "drum",
    text: "Nhờ ân đức của Bà Triệu, quân sĩ thề tử chiến không lùi. Tại trận quyết chiến Bồ Điền, đối diện với đạo quân giáp sắt khổng lồ của Lục Dận, người dân các làng bản lân cận tự nguyện vác gậy gộc, cuốc xẻng lao ra chiến trường hỗ trợ nghĩa quân.",
    choices: [
      { label: "🚩 Đây là trận chiến cuối cùng! Giương cao ngọn cờ!", nextId: "act4_true_decision" },
      { label: "⚔️ Siết chặt tay gươm, thề cùng sống chết với chủ tướng", nextId: "act4_true_decision" }
    ]
  },
  act4_true_decision: {
    chapter: "HỒI 4: HUYẾT CHIẾN BỒ ĐIỀN",
    speaker: "Bà Triệu",
    avatar: "👸",
    emotion: "heroic",
    sfx: "sword",
    text: "(Mặc áo giáp vàng, rút gươm chỉ thẳng về phía quân Ngô) Hỡi bá tánh Giao Châu! Hôm nay, dẫu máu chảy thành sông, xương chất thành núi, chúng ta cũng quyết không cúi đầu làm nô lệ! Phó tướng, theo Ta xông trận!",
    choices: [
      { label: "⚔️ Vung giáo xông thẳng vào trung quân địch!", nextId: "ending_true" },
      { label: "🛡️ Rút gươm thét vang bảo vệ sườn phải cho voi thần!", nextId: "ending_true" }
    ]
  },

  // ENDINGS BÀ TRIỆU
  ending_true: {
    chapter: "KẾT CỤC: BẢN ANH HÙNG CA",
    speaker: "Dòng Lịch Sử",
    avatar: "📜",
    emotion: "victorious",
    sfx: "horn",
    text: "Bạn cùng Bà Triệu tung hoành giữa muôn trùng quân địch. Tuy chênh lệch lực lượng quá lớn, Bà Triệu chiến đấu kiên cường đến hơi thở cuối cùng. Gươm gãy, voi gục, Bà kiêu hãnh rút gươm tự vẫn tại núi Tùng vào cuối năm 248 để giữ trọn khí tiết.",
    ending: {
      type: "historical",
      title: "TRUE ENDING: BẢN ANH HÙNG CA NÚI TÙNG",
      desc: "Năm 248 Dương Lịch, Bà Triệu tuẫn tiết. Trận chiến thất bại về quân sự, nhưng tiếng vang của tình yêu tự do và khí tiết bất khuất của Nữ anh hùng dân tộc đã trở thành ngọn đuốc rực sáng muôn đời."
    }
  },
  ending_dark: {
    chapter: "KẾT CỤC: NỮ VƯƠNG ĐẪM MÁU",
    speaker: "Dòng Lịch Sử",
    avatar: "📜",
    emotion: "angry",
    sfx: "fire",
    text: "Cơn mưa tên lửa thiêu rụi cả địch lẫn dân thường. Lục Dận tử trận, Bà Triệu giành được chiến thắng vĩ đại nhưng lại đánh mất đi nhân tâm.",
    ending: {
      type: "victory",
      title: "DARK ENDING: NỮ VƯƠNG ĐẪM MÁU",
      desc: "Bà Triệu đánh đuổi được quân Đông Ngô và lên ngôi. Tuy nhiên, đôi bàn tay vấy máu hàng ngàn người vô tội khiến vương triều lập nên bằng sự tàn nhẫn mãi chìm trong đơn độc và oán hận."
    }
  },
  ending_normal: {
    chapter: "KẾT CỤC: LƯU VONG RỪNG THẲM",
    speaker: "Dòng Lịch Sử",
    avatar: "📜",
    emotion: "solemn",
    sfx: "wind",
    text: "Bạn và Bà Triệu rút lui thành công, bảo toàn được một bộ phận nghĩa quân chạy trốn vào rừng sâu.",
    ending: {
      type: "bad",
      title: "NORMAL ENDING: LƯU VONG RỪNG THẲM",
      desc: "Cuộc sống trốn chui trốn nhủi trong rừng thiêng nước độc dần bào mòn ý chí chiến đấu. Không ai còn nhớ đến lời thề 'cưỡi cơn gió mạnh' năm xưa."
    }
  },
  ending_bad: {
    chapter: "KẾT CỤC: VẾT NHƠ LỊCH SỬ",
    speaker: "Dòng Lịch Sử",
    avatar: "📜",
    emotion: "fearful",
    sfx: "thunder",
    text: "Lựa chọn sai lầm khiến hệ thống phòng thủ sụp đổ. Bạn và Bà Triệu bị giặc bắt và chịu cảnh làm tù binh nhục nhã.",
    ending: {
      type: "bad",
      title: "BAD ENDING: VẾT NHƠ LỊCH SỬ",
      desc: "Bị lột giáp vàng, xích tay diễu phố. Sự hèn nhát và thiếu quyết đoán đã dẫn đến một thảm kịch đáng xấu hổ."
    }
  }
};

// ==============================================================================
// LÊ LỢI STORY ROUTES
// ==============================================================================

export const STORY_LELOI = {
  // HỒI 1: LỜI THỀ LŨNG NHAI
  start: {
    chapter: "HỒI 1: LỜI THỀ LŨNG NHAI",
    speaker: "Dòng Lịch Sử",
    avatar: "📜",
    emotion: "solemn",
    sfx: "wind",
    text: "Năm 1416 Dương Lịch. Rừng núi Lam Sơn âm u. Dưới ánh trăng, Lê Lợi cùng 18 chiến hữu cắt máu ăn thề tại Lũng Nhai, thề sống chết đánh đuổi giặc Minh xâm lược. Bạn là một trong 18 vị công thần đó. Sau buổi thề, Lê Lợi gọi bạn ở lại để bàn việc chiêu mộ nhân tài.",
    choices: [
      { label: "👑 Lắng nghe chủ định của Lê Lợi", nextId: "act1_advise" },
      { label: "📜 Tiến lên hiến kế tuyển mộ quân sư", nextId: "act1_advise" }
    ]
  },
  act1_advise: {
    chapter: "HỒI 1: LỜI THỀ LŨNG NHAI",
    speaker: "Lê Lợi",
    avatar: "👑",
    emotion: "heroic",
    sfx: "drum",
    text: "Nhà Minh lực lượng khổng lồ. Chỉ bằng sự quả cảm của anh em Lũng Nhai ta e là chưa đủ. Ta đang phân vân giữa hai người: Một là Nguyễn Trãi, nho sĩ mang trong mình 'Bình Ngô Sách' nhưng tay trói gà không chặt. Hai là Đinh Lễ, một mãnh tướng có thể địch vạn người. Theo khanh, ta nên ưu tiên dùng ai?",
    choices: [
      { label: "📜 Mời Nguyễn Trãi. Mưu phạt tâm công, trí tuệ mới là chìa khóa.", nextId: "act2_start_wisdom" },
      { label: "⚔️ Chiêu mộ Đinh Lễ. Chiến trường là nơi lấy máu đổi máu!", nextId: "act2_start_force" }
    ]
  },

  // HỒI 2: NÚI CHÍ LINH VÀ SỰ HI SINH
  act2_start_wisdom: {
    chapter: "HỒI 2: NÚI CHÍ LINH VÀ SỰ HI SINH",
    speaker: "Dòng Lịch Sử",
    avatar: "📜",
    emotion: "solemn",
    sfx: "wind",
    text: "Năm 1418. Nghĩa quân Lam Sơn liên tục bị quân Minh đàn áp, buộc phải rút lên núi Chí Linh. Nhờ mưu kế của Nguyễn Trãi, quân ta tránh được nhiều tổn thất nhưng tình cảnh vẫn vô cùng bi đát. Đã mấy ngày qua, tướng sĩ chỉ ăn cỏ rễ để cầm hơi.",
    choices: [
      { label: "⛺ Vào trướng gặp Lê Lợi tìm cách giải vây", nextId: "act2_chilinh_wisdom" },
      { label: "🪖 Chấn chỉnh hàng ngũ binh sĩ đang suy sụp", nextId: "act2_chilinh_wisdom" }
    ]
  },
  act2_chilinh_wisdom: {
    chapter: "HỒI 2: NÚI CHÍ LINH VÀ SỰ HI SINH",
    speaker: "Lê Lai",
    avatar: "🛡️",
    emotion: "heroic",
    sfx: "sword",
    text: "Chúa công! Quân giặc đã vây kín núi. Xin hãy cho thần mặc hoàng bào, cưỡi voi ra trận để giả danh Chúa công. Quân Minh tất sẽ xúm lại đánh. Thần nguyện liều thân để Chúa công thoát vòng vây!",
    choices: [
      { label: "👘 Đồng ý để Lê Lai đi. Lấy đại cục làm trọng!", nextId: "act3_start_righteous" },
      { label: "🛑 Kiên quyết ngăn cản, đề xuất một mưu kế nghi binh khác", nextId: "act3_start_normal" }
    ]
  },
  act2_start_force: {
    chapter: "HỒI 2: NÚI CHÍ LINH VÀ SỰ HI SINH",
    speaker: "Dòng Lịch Sử",
    avatar: "📜",
    emotion: "angry",
    sfx: "battle",
    text: "Năm 1418. Đinh Lễ quả là mãnh tướng, liên tục chém tướng đoạt cờ quân Minh. Tuy nhiên, vì thiếu chiến lược dài hạn, nghĩa quân lọt vào vòng vây khổng lồ tại núi Chí Linh. Tình hình tuyệt vọng đến mức Lê Lợi định tự vẫn để không rơi vào tay giặc.",
    choices: [
      { label: "🗡️ Lập tức xông vào trướng can ngăn Lê Lợi", nextId: "act2_chilinh_force" },
      { label: "📯 Triệu tập các tướng lĩnh tìm cách phá vây", nextId: "act2_chilinh_force" }
    ]
  },
  act2_chilinh_force: {
    chapter: "HỒI 2: NÚI CHÍ LINH VÀ SỰ HI SINH",
    speaker: "Lê Lai",
    avatar: "🛡️",
    emotion: "heroic",
    sfx: "thunder",
    text: "(Bước vào với vết thương rỉ máu) Chúa công không thể chết! Xin hãy cho thần khoác hoàng bào, đánh một trận tử chiến thu hút giặc để ngài trốn thoát. Có như vậy, máu của hàng vạn huynh đệ mới không đổ xuống vô ích!",
    choices: [
      { label: "😭 Rơi lệ chấp thuận sự hi sinh của người anh em", nextId: "act3_start_dark" },
      { label: "⚔️ Không đồng ý! Cùng nhau xông ra tử chiến!", nextId: "ending_bad" }
    ]
  },

  // HỒI 3: HỘI THỀ ĐÔNG QUAN
  act3_start_righteous: {
    chapter: "HỒI 3: HỘI THỀ ĐÔNG QUAN",
    speaker: "Dòng Lịch Sử",
    avatar: "📜",
    emotion: "victorious",
    sfx: "horn",
    text: "Lê Lai hi sinh, Lê Lợi thoát hiểm. Mười năm nếm mật nằm gai trôi qua, đạo quân Lam Sơn với mưu lược xuất quỷ nhập thần của Nguyễn Trãi đã ép Vương Thông nhà Minh phải cố thủ tại Đông Quan và xin đầu hàng.",
    choices: [
      { label: "🧥 Sửa soạn chiến bào, theo vua tiến vào đại doanh", nextId: "act3_righteous_decision" },
      { label: "🚩 Vinh quang ngẩng cao đầu đi gặp mặt kẻ thù bại trận", nextId: "act3_righteous_decision" }
    ]
  },
  act3_righteous_decision: {
    chapter: "HỒI 3: HỘI THỀ ĐÔNG QUAN",
    speaker: "Lê Lợi",
    avatar: "👑",
    emotion: "heroic",
    sfx: "drum",
    text: "Vương Thông đã dâng bảng đầu hàng năm 1427. Giờ đây trong tay ta là hàng vạn tù binh quân Minh. Các tướng sĩ muốn chém giết để rửa hận cho những năm tháng lầm than. Nhưng Nguyễn Trãi lại khuyên ta nên tha chết và cấp thuyền cho chúng về nước. Ý khanh thế nào?",
    choices: [
      { label: "🕊️ Nhân nghĩa làm gốc! Xin mở đường hiếu sinh cho tù binh.", nextId: "act4_start_true" },
      { label: "⚔️ Bọn giặc hung tàn không đáng được tha, chém vài ngàn tên để thị uy!", nextId: "act4_start_dark" }
    ]
  },
  act3_start_normal: {
    chapter: "HỒI 3: HỘI THỀ ĐÔNG QUAN",
    speaker: "Dòng Lịch Sử",
    avatar: "📜",
    emotion: "solemn",
    sfx: "wind",
    text: "Nhờ mưu kế nghi binh, cả Lê Lợi và Lê Lai đều sống sót chạy thoát khỏi Chí Linh. Tuy nhiên, cái giá phải trả là phần lớn lực lượng bị tiêu diệt. Cuộc khởi nghĩa kéo dài dằng dặc suốt 20 năm mới đánh đuổi được quân Minh.",
    choices: [
      { label: "🍺 Tham dự đại tiệc khao quân ăn mừng chiến thắng", nextId: "ending_normal" },
      { label: "🕯️ Lặng lẽ ngồi nhớ về những người đã ngã xuống", nextId: "ending_normal" }
    ]
  },
  act3_start_dark: {
    chapter: "HỒI 3: HỘI THỀ ĐÔNG QUAN",
    speaker: "Dòng Lịch Sử",
    avatar: "📜",
    emotion: "angry",
    sfx: "fire",
    text: "Máu của Lê Lai đã nhen nhóm ngọn lửa thù hận tột cùng. Đạo quân Lam Sơn thiện chiến và tàn nhẫn càn quét giặc Minh từ Nam chí Bắc. Tại Đông Quan, khi quân Minh xin hàng, binh sĩ của bạn khao khát được tàn sát.",
    choices: [
      { label: "👑 Gặp Lê Lợi xin chỉ thị xử lý tù binh", nextId: "act3_dark_decision" },
      { label: "⚔️ Trực tiếp đề xuất phương án đồ sát", nextId: "act3_dark_decision" }
    ]
  },
  act3_dark_decision: {
    chapter: "HỒI 3: HỘI THỀ ĐÔNG QUAN",
    speaker: "Lê Lợi",
    avatar: "👑",
    emotion: "angry",
    sfx: "thunder",
    text: "(Khuôn mặt lạnh băng, sát khí tỏa ra) Nợ máu phải trả bằng máu. Không có sự dung thứ cho loài cẩu trư! Phó tướng, mang 1 vạn hàng binh đó đi chôn sống đi!",
    choices: [
      { label: "💀 Tuân lệnh! Thi hành án tử hình hàng loạt!", nextId: "act4_start_dark" },
      { label: "🕊️ Bất tuân mệnh lệnh, lén thả một bộ phận tù binh", nextId: "ending_normal" }
    ]
  },

  // HỒI 4: TRẢ GƯƠM THUẬN THIÊN
  act4_start_true: {
    chapter: "HỒI 4: TRẢ GƯƠM THUẬN THIÊN",
    speaker: "Dòng Lịch Sử",
    avatar: "📜",
    emotion: "victorious",
    sfx: "horn",
    text: "Năm 1428 Dương Lịch. Hành động nhân nghĩa của Lê Lợi vang danh thiên hạ. Đại Cáo Bình Ngô được ban bố, đất nước đón nền thái bình. Một ngày nọ, bạn tháp tùng vua dạo thuyền trên hồ Tả Vọng. Mặt nước bỗng sủi bọt, một con rùa vàng khổng lồ ngoi lên.",
    choices: [
      { label: "🐢 Kinh ngạc nhìn về phía Thần Quy", nextId: "act4_true_decision" },
      { label: "🗡️ Rút gươm chắn phía trước bảo vệ nhà vua", nextId: "act4_true_decision" }
    ]
  },
  act4_true_decision: {
    chapter: "HỒI 4: TRẢ GƯƠM THUẬN THIÊN",
    speaker: "Kim Quy (Rùa Vàng)",
    avatar: "🐢",
    emotion: "heroic",
    sfx: "water",
    text: "(Gầm gừ tĩnh tại giữa làn sóng xanh) Hỡi đấng minh quân! Giặc dữ đã tan, non sông đã liền một dải. Nay xin Hoàng đế hãy hoàn trả lại Gươm Thần Thuận Thiên cho Long Quân!",
    choices: [
      { label: "🗡️ Nhắc nhở vua: 'Xin bệ hạ trao trả báu vật, lập đài thái bình!'", nextId: "ending_true" },
      { label: "👑 Nhắc nhở vua: 'Gươm báu là biểu tượng quyền lực, không thể trả!'", nextId: "ending_dark" }
    ]
  },
  act4_start_dark: {
    chapter: "HỒI 4: TRẢ GƯƠM THUẬN THIÊN",
    speaker: "Dòng Lịch Sử",
    avatar: "📜",
    emotion: "solemn",
    sfx: "thunder",
    text: "Việc tàn sát tù binh khiến triều đình nhà Minh thịnh nộ. Vương triều Hậu Lê được lập nên nhưng phủ bóng đen của bạo lực và nghi kỵ. Tại hồ Tả Vọng, Kim Quy ngoi lên đòi lại gươm thần.",
    choices: [
      { label: "🤐 Im lặng chờ xem Lê Lợi quyết định thế nào", nextId: "act4_dark_decision" },
      { label: "🐢 Bàng hoàng nhìn con rùa khổng lồ ngóc đầu lên mặt nước", nextId: "act4_dark_decision" }
    ]
  },
  act4_dark_decision: {
    chapter: "HỒI 4: TRẢ GƯƠM THUẬN THIÊN",
    speaker: "Lê Lợi",
    avatar: "👑",
    emotion: "angry",
    sfx: "thunder",
    text: "(Nắm chặt chuôi gươm Thuận Thiên) Gươm này do trẫm vào sinh ra tử mới có được. Non sông này là do máu thịt quân ta xây nên. Nay trả gươm, nhỡ ngày mai giặc phương Bắc lại tràn sang thì sao? Rùa vàng, trẫm tuyệt đối không trả!",
    choices: [
      { label: "🚩 Hoan hô quyết định sáng suốt của nhà vua", nextId: "ending_dark" },
      { label: "😨 Cúi đầu lo sợ điềm gở giáng xuống vương triều", nextId: "ending_dark" }
    ]
  },

  // ENDINGS LÊ LỢI
  ending_true: {
    chapter: "KẾT CỤC: TRUYỀN THUYẾT HỒ GƯƠM",
    speaker: "Dòng Lịch Sử",
    avatar: "📜",
    emotion: "victorious",
    sfx: "water",
    text: "Lê Lợi kính cẩn nâng gươm thần ném về phía Kim Quy. Rùa vàng ngậm lấy thanh gươm sáng rực, lặn xuống đáy hồ. Hồ Tả Vọng từ đó được đổi tên thành Hồ Hoàn Kiếm.",
    ending: {
      type: "victory",
      title: "TRUE ENDING: TRUYỀN THUYẾT HỒ GƯƠM",
      desc: "Bằng trí tuệ, lòng nhân đạo và đại nghĩa, bạn đã phò tá Lê Thái Tổ thu non sông về một mối. Tên tuổi của bạn được lưu truyền muôn đời như một công thần khai quốc vĩ đại của triều đại Hậu Lê rực rỡ nhất lịch sử."
    }
  },
  ending_dark: {
    chapter: "KẾT CỤC: VƯƠNG TRIỀU KHÁT MÁU",
    speaker: "Dòng Lịch Sử",
    avatar: "📜",
    emotion: "angry",
    sfx: "fire",
    text: "Lê Lợi rút gươm thần chém về phía mặt nước. Kim Quy nổi giận gầm lên một tiếng, lặn mất tăm. Nước hồ bỗng chốc đục ngầu.",
    ending: {
      type: "bad",
      title: "DARK ENDING: VƯƠNG TRIỀU KHÁT MÁU",
      desc: "Lòng tham quyền lực và sự nghi kị đã biến Lê Lợi thành một bạo chúa. Nhà vua lần lượt sát hại các công thần, triều đình chìm trong tắm máu."
    }
  },
  ending_normal: {
    chapter: "KẾT CỤC: NGAI VÀNG CÔ ĐỘC",
    speaker: "Dòng Lịch Sử",
    avatar: "📜",
    emotion: "solemn",
    sfx: "wind",
    text: "Không có huyền thoại hồ Gươm nào xảy ra. Đất nước sạch bóng quân thù, nhưng những người huynh đệ năm xưa ở Lũng Nhai đã chẳng còn ai.",
    ending: {
      type: "bad",
      title: "NORMAL ENDING: NGAI VÀNG CÔ ĐỘC",
      desc: "Một cái kết thực tế và đau thương. Bạn chọn cách cáo quan về ở ẩn vì không chịu nổi sự lạnh lẽo của chốn quan trường. Đế vương luôn phải cô độc."
    }
  },
  ending_bad: {
    chapter: "KẾT CỤC: NGỌN LỬA CHẾT YỂU",
    speaker: "Dòng Lịch Sử",
    avatar: "📜",
    emotion: "fearful",
    sfx: "thunder",
    text: "Sự bốc đồng và cứng nhắc đã phá hủy hoàn toàn lực lượng khởi nghĩa tại núi Chí Linh. Bạn và Lê Lợi tử trận trong vòng vây của hàng vạn quân Minh.",
    ending: {
      type: "bad",
      title: "BAD ENDING: NGỌN LỬA CHẾT YỂU",
      desc: "Không có truyền thuyết nào được sinh ra. Khởi nghĩa Lam Sơn kết thúc bi thảm. Đất nước tiếp tục đắm chìm trong sự đô hộ tàn bạo của giặc Minh."
    }
  }
};
